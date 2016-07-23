const SocketIO = require('socket.io')
const socketioJwt = require('socketio-jwt')
const {compact, union, pull, omit, merge} = require('lodash')

const tokenConfig = require('../shared/config/token')
const Event = require('../shared/models/Event')
const Thing = require('../shared/models/Thing')
const User = require('../shared/models/User')
const EventTransformer = require('../shared/transformers/event-transformer')
const logger = require('../shared/utils/logger')
const EventTypes = require('../../common/enums/event-types')

module.exports = (app) => {
    const io = SocketIO(app.server, {path: '/push'})
    let sockets = {}

    acceptConnections()
    listenToEventChanges()

    function acceptConnections() {
        io.on('connection', socketioJwt.authorize({
            secret: tokenConfig.pushSecret,
            timeout: 15000
        })).on('authenticated', socket => {
            sockets[socket.decoded_token.id] = socket

            socket.on('disconnect', () => {
                delete sockets[socket.decoded_token.id]
            })
        })
    }

    function listenToEventChanges() {
        Event.changes()
            .then(auditNewEvents)
            .catch(error => {
                logger.error('Error reading changes from the DB:', error)
            })
    }

    function auditNewEvents(changes) {
        changes.each((error, doc) => {
            getFullEvent(doc, error).then(auditEvent)
        })
    }

    function getFullEvent(doc, error) {
        if (error) {
            logger.error('Error reading changes from the DB:', error)
            return Promise.resolve(null)
        }

        // If the document is not new (old value exists) or the document had been deleted, we wouldn't want to audit it later.
        if (!!doc.getOldValue() || !doc.isSaved()) {
            return Promise.resolve(null)
        }

        const event = docToObject(doc)
        return setThingToEvent(event).then(setCreatorToEvent)
    }

    function setThingToEvent(event) {
        return Thing.get(event.thingId).run().then(thing => {
            event.thing = thing
            return event
        })
    }

    function setCreatorToEvent(event) {
        return User.get(event.creatorUserId).run().then(creator => {
            event.creator = creator
            return event
        })
    }

    function auditEvent(event) {
        if (event && event.showNewList && event.showNewList.length) {
            logger.info(`New change to audit: event ${event.eventType} on thing ${event.thingId}`)
            event.showNewList.forEach(userId => {
                const socket = sockets[userId]
                if (socket) {
                    const user = socket.decoded_token
                    socket.emit('whatsnew', EventTransformer.docToDto(event, user))
                }
            })
        }

        // TODO: should we only send new comment to subscribed clients (those with open task page?)
        if (event && event.eventType === EventTypes.COMMENT.key) {
            logger.info(`New change to audit: comment on thing ${event.thingId}`)

            const subscribers = pull(union(event.thing.doers,
                event.thing.followUpers, [event.thing.toUserId, event.thing.creatorUserId]), event.creatorUserId)

            subscribers.forEach(userId => {
                const socket = sockets[userId]
                if (socket) {
                    const user = socket.decoded_token
                    socket.emit('new-comment',
                        addThingIdToNewComment(
                            EventTransformer.docToDto(omit(event,'thing', 'eventType'),  user), event.thingId))
                }
            })
        }
    }

    function addThingIdToNewComment(comment, thingId) {
        return merge({}, comment, { thing: {
            id: thingId
        }})
    }

    function docToObject(doc) {
        return JSON.parse(JSON.stringify(doc))
    }
}

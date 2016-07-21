const SocketIO = require('socket.io')
const socketioJwt = require('socketio-jwt')
const {compact} = require('lodash')

const tokenConfig = require('../shared/config/token')
const Event = require('../shared/models/Event')
const Thing = require('../shared/models/Thing')
const User = require('../shared/models/User')
const EventTransformer = require('../shared/transformers/event-transformer')
const logger = require('../shared/utils/logger')

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
            .error(error => {
                logger.error('Error reading changes from the DB:', error)
            })
            // .then(listenToEventChanges)
    }

    function auditNewEvents(changes) {
        return new Promise((resolve, reject) => {
            let promises = []
            changes.each((error, doc) => {
                promises.push(getFullEvent(doc, error).then(auditEvent))
            })
            Promise.all(promises).then(results => resolve(compact(results)))
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
    }

    function docToObject(doc) {
        return JSON.parse(JSON.stringify(doc))
    }
}

const SocketIO = require('socket.io')
const socketioJwt = require('socketio-jwt')
const {union, difference} = require('lodash')

const tokenConfig = require('../shared/config/token')
const Event = require('../shared/models/Event')
const Thing = require('../shared/models/Thing')
const EventTransformer = require('../shared/transformers/event-transformer')
const logger = require('../shared/utils/logger')

module.exports = (app) => {
    const io = SocketIO(app.server, {path: '/push'})

    acceptConnections()
    listenToEventChanges()

    function acceptConnections() {
        io.on('connection', socketioJwt.authorize({
            secret: tokenConfig.pushSecret,
            timeout: 15000
        })).on('authenticated', socket => {

            // Join the user to the user id room
            socket.join(socket.decoded_token.id)
        })
    }

    function listenToEventChanges() {
        Event.changes()
            .then(auditChanges)
            .catch(error => {
                logger.error('Error reading changes from the DB:', error)
            })
    }

    function auditChanges(changes) {
        changes.each((error, doc) => {
            if (error) {
                logger.error('Error reading changes from the DB:', error)
            } else {
                auditEvent(doc)
            }
        })
    }

    function auditEvent(event) {
        const oldEvent = event.getOldValue()

        if (oldEvent) {
            auditChangedEvent(oldEvent, event)
        } else if (event.isSaved()) {
            auditNewEvent(event)
        }
    }

    function auditChangedEvent(oldEvent, event) {
        const readByUsers = difference(oldEvent.showNewList, event.showNewList)

        readByUsers.forEach(userId => {
            io.to(userId).emit('notification-deleted', {id: event.id})
        })
    }

    function auditNewEvent(event) {
        logger.info(`New change to audit: event ${event.eventType} on thing ${event.thingId}`)

        Event.getFullEvent(event.id)
            .then(fullEvent => {

                // Sending notification to any user that might have interest in new event
                const subscribers = union(fullEvent.showNewList, fullEvent.thing.doers,
                    fullEvent.thing.followUpers, [fullEvent.thing.toUserId, fullEvent.thing.creatorUserId])

                // TODO: we are not testing if the room even exist
                subscribers.forEach(userId => {
                    const user = {id: userId}
                    const dto = EventTransformer.docToDto(fullEvent, user)
                    io.to(userId).emit('new-event', dto)
                })
            })
            .catch(error => logger.error('error while fetching new event from db', error))
    }
}

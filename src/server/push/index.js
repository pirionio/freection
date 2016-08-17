const SocketIO = require('socket.io')
const socketioJwt = require('socketio-jwt')
const {union, difference} = require('lodash')

const tokenConfig = require('../shared/config/token')
const {Event, MailNotification} = require('../shared/models')
const Thing = require('../shared/models/Thing')
const {eventToDto} = require('../shared/application/transformers')
const logger = require('../shared/utils/logger')
const EventTypes = require('../../common/enums/event-types')

module.exports = (app) => {
    const io = SocketIO(app.server, {path: '/push'})

    acceptConnections()
    listenToEventChanges()
    listenToMailNotifications()

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

    function listenToMailNotifications() {
        MailNotification.changes()
            .then(auditMailNotifications)
            .catch(error => {
                logger.error('Error reading mail notifications from the DB:', error)
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

    function auditMailNotifications(changes) {
        changes.each((error, doc) => {
            if (error) {
                logger.error('Error reading changes from the DB:', error)
            } else {
                // TODO: we might want to emit a different notification on update
                if (doc.type === 'NEW' || doc.type === 'UPDATE')
                    io.to(doc.id).emit('email-notification')
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
        const shownToUsers = difference(oldEvent.showNewList, event.showNewList)

        shownToUsers.forEach(userId => {
            io.to(userId).emit('notification-deleted', {id: event.id})
        })

        if ([EventTypes.COMMENT.key, EventTypes.CREATED.key, EventTypes.PING.key, EventTypes.PONG.key].includes(event.eventType)) {
            const readByUsers = difference(event.payload.readByList, oldEvent.payload.readByList)

            readByUsers.forEach(userId => {
                io.to(userId).emit('comment-read-by', {
                    id: event.id,
                    thing: {
                        id: event.thingId
                    }
                })
            })
        }
    }

    function auditNewEvent(event) {
        logger.info(`New change to audit: event ${event.eventType} on thing ${event.thingId}`)

        Event.getFullEvent(event.id)
            .then(fullEvent => {

                // Sending notification to any user that might have interest in new event
                const subscribers = union(fullEvent.showNewList, fullEvent.thing.doers,
                    fullEvent.thing.followUpers, [fullEvent.thing.to.id, fullEvent.thing.creator.id])

                // TODO: we are not testing if the room even exist
                subscribers.forEach(userId => {
                    const user = {id: userId}
                    const dto = eventToDto(fullEvent, user)
                    io.to(userId).emit('new-event', dto)
                })
            })
            .catch(error => logger.error('error while fetching new event from db', error))
    }
}

import SocketIO from 'socket.io'
import socketioJwt from 'socketio-jwt'
import {union, difference} from'lodash'

import tokenConfig from '../shared/config/token'
import {Event, MailNotification} from '../shared/models'
import logger from '../shared/utils/logger'
import {eventToDto} from '../shared/application/transformers'
import SharedConstants from '../../common/shared-constants'
import {crash} from '../shared/utils/graceful-shutdown'

export function configure(app) {
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
                crash()
            })
    }

    function listenToMailNotifications() {
        MailNotification.changes()
            .then(auditMailNotifications)
            .catch(error => {
                logger.error('Error reading mail notifications from the DB:', error)
                crash()
            })
    }

    function auditChanges(changes) {
        changes.each((error, doc) => {
            if (error) {
                logger.error('Error reading changes from the DB:', error)
                crash()
            } else {
                auditEvent(doc)
            }
        })
    }

    function auditMailNotifications(changes) {
        changes.each((error, doc) => {
            if (error) {
                logger.error('Error reading changes from the DB:', error)
                crash()
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

        if (SharedConstants.MESSAGE_TYPED_EVENTS.includes(event.eventType)) {
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

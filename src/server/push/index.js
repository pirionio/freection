import SocketIO from 'socket.io'
import socketioJwt from 'socketio-jwt'
import {union, difference, chain} from'lodash'

import tokenConfig from '../shared/config/token'
import {Event, MailNotification, User, Thing} from '../shared/models'
import logger from '../shared/utils/logger'
import {eventToDto} from '../shared/application/transformers'
import {userToAddress} from '../shared/application/address-creator.js'
import SharedConstants from '../../common/shared-constants'
import {crash} from '../shared/utils/graceful-shutdown'

export function configure(app) {
    const io = SocketIO(app.server, {path: '/push'})

    acceptConnections()
    listenToEventChanges()
    listenToMailNotifications()
    listenToUsers()

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

    function listenToUsers() {
        User.changes()
            .then(auditUsers)
            .catch(error => {
                logger.error('Error reading user changes from the DB:', error)
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

    function auditUsers(changes) {
        changes.each((error, doc) => {
            if (error) {
                logger.error('Error reading user changes from the DB:', error)
                crash()
            } else {
                const oldUser = doc.getOldValue()
                if (!oldUser)
                    auditNewUser(doc)
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

    async function auditChangedEvent(oldEvent, event) {
        const shownToUsers = difference(oldEvent.showNewList, event.showNewList)
        const newUsers = difference(event.showNewList, oldEvent.showNewList)

        shownToUsers.forEach(userId => {
            io.to(userId).emit('notification-deleted', {id: event.id})
        })

        if (newUsers && newUsers.length !== 0) {
            try {
                const fullEvent = await Event.getFullEvent(event.id, true)
                sendNewEvent(fullEvent, newUsers)
            } catch(error) {
                logger.error('error while fetching full event from db', error)
            }
        }

        if (SharedConstants.MESSAGE_TYPED_EVENTS.includes(event.eventType)) {
            const readByUsers = difference(event.payload.readByList, oldEvent.payload.readByList)
            const readByEmailUsers = difference(event.payload.readByEmailList, oldEvent.payload.readByEmailList)

            if (readByUsers.length || readByEmailUsers.length) {
                const thing = await Thing.get(event.thingId).run()

                readByUsers.forEach(readByUserId => {
                    thing.all.forEach(userId => {
                        io.to(userId).emit('comment-read-by', {
                            id: event.id,
                            isReadByMe: userId === readByUserId,
                            readByUserId: readByUserId,
                            thing
                        })
                    })
                })

                readByEmailUsers.forEach(readByEmail => {
                    thing.all.forEach(userId => {
                        io.to(userId).emit('comment-read-by-email', {
                            id: event.id,
                            readByEmail: readByEmail,
                            thing
                        })
                    })
                })
            }
        }
    }

    function auditNewEvent(event) {
        logger.info(`New change to audit: event ${event.eventType} on thing ${event.thingId} by ${event.creator.displayName}`)

        Event.getFullEvent(event.id, true)
            .then(fullEvent => {

                // Sending notification to any user that might have interest in new event
                const subscribers = union(fullEvent.showNewList, fullEvent.thing.doers,
                    fullEvent.thing.followUpers, fullEvent.thing.subscribers, fullEvent.thing.mentioned, [fullEvent.thing.to.id, fullEvent.thing.creator.id])

                sendNewEvent(fullEvent, subscribers)
            })
            .catch(error => logger.error('error while fetching new event from db', error))
    }

    function sendNewEvent(event, users) {
        // TODO: we are not testing if the room even exist
        users.forEach(userId => {
            const user = {id: userId}
            const dto = eventToDto(event, user, {includeFullThing: true})
            io.to(userId).emit('new-event', dto)
        })
    }

    async function auditNewUser(user) {
        const userAddress = userToAddress(user)

        const users = chain(await User.getOrganizationUsers(user.organization))
            .map(u => u.id)
            .reject(userId => user.id === userId)
            .value()

        users.forEach(userId => io.to(userId).emit('new-user', userAddress))
    }
}

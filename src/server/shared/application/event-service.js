const {Event} = require('../models')
const logger = require('../utils/logger')

function discardById(user, eventId) {
    return Event.discardUserEventById(eventId, user.id)
        .catch(error => {
            logger.error(`Could not discard event ${eventId} unread by user ${user.email}`, error)
            throw error
        })
}

function discardByType(user, thingId, eventType) {
    return Event.discardUserEventsByType(thingId, eventType, user.id)
        .catch(error => {
            logger.error(`Could not discard events of type ${eventType} unread by user ${user.email} for thing ${thingId}`, error)
            throw error
        })
}

function markAsRead(user, eventId) {
    return Event.markAsRead(eventId, user.id)
        .catch(error => {
            logger.error(`Could not mark event ${eventId} as read by user ${user.email}`, error)
            throw error
        })
}

module.exports = {
    discardById,
    discardByType,
    markAsRead
}

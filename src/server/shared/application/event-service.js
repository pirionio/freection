import {Event} from '../models'
import logger from '../utils/logger'
import * as EmailService from './email-service'

export function discard(user, eventId) {
    return Event.discardUserEventById(eventId, user.id)
        .catch(error => {
            logger.error(`Could not discard event ${eventId} unread by user ${user.email}`, error)
            throw error
        })
}

export async function markAsRead(user, eventId) {
    try {
        await Event.markAsRead(eventId, user.id)

        const event = await Event.get(eventId).run()
        if (event.payload && event.payload.emailId) {
            await EmailService.markAsReadByMessageId(user, event.payload.emailId)
        }
    } catch(error) {
        logger.error(`Could not mark event ${eventId} as read by user ${user.email}`, error)
        throw error
    }

}
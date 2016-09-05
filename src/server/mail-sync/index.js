import dateFns from 'date-fns'
import {last} from 'lodash'

import * as EmailService from '../shared/application/email-service'
import * as ThingService from '../shared/application/thing-service'
import {MailNotification, User} from '../shared/models'
import logger from '../shared/utils/logger'

export function configure() {
    MailNotification.changes()
        .then(changes => changes.each(onChange))

    function onChange(error, doc) {
        if (error) {
            logger.error('Error reading mail notifications from the DB:', error)
        } else {
            const userId = doc.id

            // we don't handle update notifications
            if (doc.type === 'UPDATE')
                return

            User.get(userId).run()
                .then(user => {
                    getLastInternalDate(user)
                        .then(lastFetchedEmailDate => EmailService.getEmailsSince(user, lastFetchedEmailDate))
                        .then(messages => {
                            if (messages.length) {
                                const promises = messages.filter(message => message.relatedThingId).map(syncMessage)

                                return Promise.all(promises)
                                    .then(() => updateUserWithWithLatestEmail(user, last(messages)))
                            }
                        })
                        .catch(error => {
                            // We might don't have any emails in the mailbox, just ignore and do it next time
                            if (error !== 'NotFound')
                                logger.error(`error while syncing user ${user.email}`, error)
                        })
                })
                .catch(error => {
                    logger.error(`error while fetching userid ${userId}`, error)
                })
        }
    }

    function updateUserWithWithLatestEmail(user, email) {
        return User.get(user.id).update({lastFetchedEmailDate: email.internalDate}).run()
    }

    function syncMessage(message) {
        const thingId = message.relatedThingId
        return ThingService.syncThingWithMessage(thingId, message)
    }

    function getLastInternalDate(user) {
        if (!user.lastFetchedEmailDate) {
            return EmailService.getLastInternalDate(user)
                .then(lastFetchedEmailDate => dateFns.subDays(lastFetchedEmailDate, 1))
        }

        return Promise.resolve(user.lastFetchedEmailDate)
    }
}

const dateFns = require('date-fns')
const {last} = require('lodash')

const EmailService = require('../shared/application/email-service')
const ThingService = require('../shared/application/thing-service')
const {MailNotification, Thing, User} = require('../shared/models')
const logger = require('../shared/utils/logger')

module.exports = function() {
    MailNotification.changes().
        then(changes => changes.each(onChange))

    function onChange(error, doc) {
        if (error) {
            logger.error('Error reading mail notifications from the DB:', error)
        } else {
            const userId = doc.id

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
                    logger.error(`error while fetching userid ${userId}`)
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
        } else {
            return Promise.resolve(user.lastFetchedEmailDate)
        }
    }
}

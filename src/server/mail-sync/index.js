const GoogleImapConnectionPool = require('../shared/utils/imap/google-imap-connection-pool')
const EmailService = require('../shared/application/email-service')
const ThingService = require('../shared/application/thing-service')
const {MailNotification, Thing, Event} = require('../shared/models')
const logger = require('../shared/utils/logger')

module.exports = function() {
    MailNotification.changes().
        then(changes => changes.each(onChange))

    function onChange(error, doc) {
        if (error) {
            logger.error('Error reading mail notifications from the DB:', error)
        } else {
            const userId = doc.id
            const user = {id: userId}

            Thing.getThingsWithEmailByUser(userId)
                .then(things => {
                    things.forEach(thing => syncThing(user, thing))
                })
        }
    }

    function syncThing(user, thing) {
        getThread(user, thing)
            .then(thread => ThingService.syncThingWithThread(thing.id, thread))
            .catch(error => {
                logger.error('error while syncing thing', error)
            })
    }

    function getThread(user, thing) {
        return EmailService.getThreadIdOfEmail(user, thing.getEmailId())
            .then(threadId => EmailService.fetchFullThread(user, threadId))
    }
}

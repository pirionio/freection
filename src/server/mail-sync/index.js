const {chain} = require('lodash')

const logger = require('../shared/utils/logger')
const {User, Event, Thing, uuid} = require('../shared/models')
const promisify = require('../shared/utils/promisify')
const ImapConnectionPool = require('../shared/utils/imap/imap-connection-pool')
const EventTypes = require('../../common/enums/event-types')
const EntityTypes = require('../../common/enums/entity-types')
const ThingStatus = require('../../common/enums/thing-status')

require('../shared/utils/promiseExtensions')

function createConnection(user) {
    return ImapConnectionPool.getConnection(user)
        .catch(error => {
            logger.error(`error while connecting to mailbox of ${user.email}`, error)
            throw error
        })
}

function isThing(tuple) {
    const {message, user} = tuple

    return new Promise((resolve, reject) => {

        // Does the message address to one user?
        if (message.header.to.length != 1)
            return resolve(false)

        const toEmail = chain(message.header.to)
            .map(to => `${to.username}@${to.organization}`)
            .head()
            .value()

        // Does the message addressed to me?
        if (toEmail != user.email)
            resolve(false)

        // From exist
        if (!message.header.from)
            resolve(false)

        // From email
        const fromEmail = `${message.header.from.username}@${message.header.from.organization}`

        User.getUserByEmail(fromEmail)
            .then(fromUser => {
                resolve({message, user, fromUser})
            })
            .catch(err => {
                if (err === "NotFound")
                    resolve(false)
                else
                    reject(err)
            })
    })
}

function convertToThingAndEvents(tuple) {
    const {message, fromUser, user} = tuple

    // TODO: we are going to the server to generate each of the uuid, we should do something faster on the client side
    return uuid().then(thingId => {

        const thing = {
            id: thingId,
            createdAt: message.header.date,
            creatorUserId: fromUser.id,
            toUserId: user.id,
            body: message.body,
            subject: message.header.subject,
            doers: [],
            followUpers: [],
            type: EntityTypes.THING.key,
            payload: {
                status: ThingStatus.NEW.key
            }
        }

        const event = {
            thingId,
            creatorUserId: fromUser.id,
            eventType: EventTypes.CREATED.key,
            createdAt: message.header.date,
            showNewList: [user.id]
        }

        return {thing, events:[event]}
    })
}

function fetchUserEmails(connection, user) {
    let lastFetchedEmail = user.lastFetchedEmail

    return connection.getUnseenMessages(lastFetchedEmail)
        .then(messages => {
            if (messages.length > 0) {
                lastFetchedEmail = chain(messages)
                    .map(message => message.header.uid)
                    .max()
                    .value()
            }

            return messages
        })
        .then(messages => messages.map(message => {
            // Convert the message to a tuple with a user and message
            return {message, user}
        }))
        .then(tuples => tuples.map(tuple => isThing(tuple)))
        .then(promises => Promise.compact(promises))
        .then(tuples => tuples.map(tuple => convertToThingAndEvents(tuple)))
        .then(promies => Promise.all(promies))
        .then(tuples => {
            if (user.lastFetchedEmail != lastFetchedEmail) {
                return {
                    user,
                    lastFetchedEmail,
                    things: chain(tuples).map(tuple => tuple.thing).value(),
                    events: chain(tuples).map(tuple => tuple.events).flatten().value()
                }
            } else {
                return null
            }
        })
}

function saveThings(tuples) {
    if (tuples.length > 0) {
        const things = chain(tuples).map(tuple => tuple.things).flatten().value()
        const events = chain(tuples).map(tuple => tuple.events).flatten().value()

        logger.info(`saving ${things.length} new things from email`)

        const promises = tuples.map(tuple => {
            const {user, lastFetchedEmail} = tuple

            return user.merge({lastFetchedEmail}).save()
        })

        return Promise.all(promises)
            .then(() => Thing.save(things))
            .then(() => Event.save(events))
    }
}

function syncEmails() {
    logger.info('syncMail started')

    User.run()
        .then(users => {
            return users.map(user => {
                return createConnection(user)
                    .then(connection => {
                        return fetchUserEmails(connection, user).then(result => {
                            ImapConnectionPool.releaseConnection(user, connection)
                            return result
                        })
                    })
            })
        })
        .then(promises => Promise.compact(promises))
        .then(saveThings)
        .then(() => logger.info(`syncEmail completed`))
        .catch(err => logger.error('error thrown while fetching emails', err))
        .then(() => setTimeout(syncEmails, 60 * 1000))
}

module.exports.start = () => {
    syncEmails()
}









const OAuth2 = require('google-auth-library/lib/auth/oauth2client')
const {chain} = require('lodash')

const logger = require('../shared/utils/logger')
const config = require('../shared/config/google-oauth')
const {User, Event, Thing, uuid} = require('../shared/models')
const promisify = require('../shared/utils/promisify')
const Connection = require('./Connection')
const EventTypes = require('../../common/enums/event-types')
const ThingTypes = require('../../common/enums/thing-types')
const ThingStatus = require('../../common/enums/thing-status')

require('../shared/utils/promiseExtensions')

const connections = new Map()

function getConection(user) {
    if (connections.has(user.id))
        return Promise.resolve(connections.get(user.id))
    else {
        return getNewAccessToken(user)
            .then(accessToken => createNewConnection(accessToken, user))
            .then(connection => {
                connections.set(user.id, connection)
                return connection
            })
    }
}

function getNewAccessToken(user) {
    const oauth2 = new OAuth2(config.clientID, config.clientSecret)
    promisify(oauth2, ['getAccessToken'])
    oauth2.setCredentials({refresh_token: user.refreshToken})
    return oauth2.getAccessTokenAsync()
}

function createNewConnection(accessToken, user) {
    const char1 = String.fromCharCode(1)
    const xoauth2 = `user=${user.email}${char1}auth=Bearer ${accessToken}${char1}${char1}`

    const connection = new Connection({
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        xoauth2: new Buffer(xoauth2).toString('base64')
    })

    return connection.connect()
        .then(() => connection)
        .catch(err => {
            logger.error(`error while connecting to mailbox of ${user.email}`, err)
            throw err
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
            type: ThingTypes.THING.key,
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
                return getConection(user)
                    .then(connection => fetchUserEmails(connection, user))
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









const connectionCache = require('../utils/imap/google-imap-connection-cache')
const {User, MailNotification} = require('../models')
const logger = require('../utils/logger')

function onMail(userId, email) {
    logger.info(`new emails for user ${email}`)

    MailNotification.save({
        id: userId,
        timestamp: new Date(),
        payload: {}
    }, { conflict: 'replace' })
}

function hello(user) {
    const existConnection = connectionCache.getConnection(user)

    // If connection exist we just continue
    if (existConnection)
        return Promise.resolve()

    return User.get(user.id).run()
        .then(fullUser => connectionCache.createConnection(fullUser))
        .then(connection => {
            logger.info(`created push imap connection for ${user.email}`)

            connection.onMail(() => onMail(user.id, user.email))
        })
}

function keepAlive(user) {
    const existConnection = connectionCache.getConnection(user)

    // If connection doesn't exist we throw an exception
    if (!existConnection)
        throw 'NoConnection'
}

module.exports = {hello, keepAlive}
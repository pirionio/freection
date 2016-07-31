const {chain} = require('lodash/core')

const ImapConnectionPool = require('../shared/utils/imap/imap-connection-pool')
const logger = require('../shared/utils/logger')
const {emailToDto} = require('../shared/transformers')

function establishConnection(user) {
    return connect(user)
        .catch(error => {
            logger.error(`Error while connecting to mailbox of ${user.email}`, error)
            return reEstablishConnection(user)
        })
        .catch(error => {
            logger.error(`Error after trying to re-establish connection to mailbox of ${user.email}`, error)
            throw error
        })
}

function connect(user) {
    return ImapConnectionPool.getConnection(user).then(connection => connection.connect())
}

function reEstablishConnection(user) {
    logger.info(`Re-establishing IMAP connection for user ${user.email}`)
    ImapConnectionPool.removeConnection(user)
    return connect(user)
}

function fetchUnreadMessages(user) {
    return establishConnection(user)
        .then(connection => connection.getUnseenMessages())
}

function fetchFullThread(user, emailThreadId) {
    return establishConnection(user)
        .then(connection => connection.getThreadMessages(emailThreadId))
        .then(prepareThread)
}

function prepareThread(emails) {
    const firstEmail = chain(emails).sortBy('header.date').head().value()
    const threadDto = emailToDto(firstEmail)
    threadDto.messages = emails.map(emailToDto)
    return threadDto
}

module.exports = app => {
    // TODO Add auth

    app.get('/emails/api/unread', (request, response) => {
        const user = request.user
        fetchUnreadMessages(user).then(emails => response.json(emails.map(emailToDto)))
    })

    app.get('/emails/api/:emailThreadId', (request, response) => {
        const user = request.user
        const {emailThreadId} = request.params
        fetchFullThread(user, emailThreadId).then(thread => response.json(thread))
    })
}

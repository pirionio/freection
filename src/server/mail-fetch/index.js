const {chain} = require('lodash/core')

const ImapConnectionPool = require('../shared/utils/imap/imap-connection-pool')
const {emailToDto} = require('../shared/transformers')
const logger = require('../shared/utils/logger')

function establishConnection(user) {
    return ImapConnectionPool.getConnection(user)
}

function fetchUnreadMessages(user) {
    return establishConnection(user)
        .then(connection => {
            return connection.getUnseenMessages()
                .then(emails => {
                    ImapConnectionPool.releaseConnection(user, connection)
                    return emails
                })
        })
}

function fetchFullThread(user, emailThreadId) {
    return establishConnection(user)
        .then(connection => {
            return connection.getThreadMessages(emailThreadId)
                .then(emails => {
                    ImapConnectionPool.releaseConnection(user, connection)
                    return emails
                })
        })
        .then(prepareThread)
}

function prepareThread(emails) {
    const firstEmail = chain(emails).sortBy('header.date').head().value()
    const threadDto = emailToDto(firstEmail)
    threadDto.messages = emails.map(emailToDto)
    return threadDto
}

function markAsRead(user, emailIds) {
    return establishConnection(user)
        .then(connection => {
            return connection.markAsRead(emailIds).then(() => ImapConnectionPool.releaseConnection(user, connection))
        })
}

module.exports = app => {
    // TODO Add auth

    app.get('/emails/api/unread', (request, response) => {
        const user = request.user
        fetchUnreadMessages(user)
            .then(emails => response.json(emails.map(emailToDto)))
            .catch(error => {
                const message = 'Error while fetching unread emails'
                logger.error(message, error)
                response.status(500).send(message)
            })
    })

    app.get('/emails/api/:emailThreadId', (request, response) => {
        const user = request.user
        const {emailThreadId} = request.params
        fetchFullThread(user, emailThreadId)
            .then(thread => response.json(thread))
            .catch(error => {
                const message = `Error while fetching thread ${emailThreadId}`
                logger.error(message, error)
                response.status(500).send(message)
            })
    })

    app.post('/emails/api/markasread', (request, response) => {
        const user = request.user
        const {emailIds} = request.body
        markAsRead(user, emailIds)
            .then(() => response.json({}))
            .catch(error => {
                const message = 'Error while marking emails as read'
                logger.error(message, error)
                response.status(500).send(message)
            })
    })
}

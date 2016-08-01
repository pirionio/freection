const {chain} = require('lodash/core')

const ImapConnectionPool = require('../shared/utils/imap/imap-connection-pool')
const {emailToDto} = require('../shared/transformers')

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
        fetchUnreadMessages(user).then(emails => response.json(emails.map(emailToDto)))
    })

    app.get('/emails/api/:emailThreadId', (request, response) => {
        const user = request.user
        const {emailThreadId} = request.params
        fetchFullThread(user, emailThreadId).then(thread => response.json(thread))
    })

    app.post('/emails/api/markasread', (request, response) => {
        const user = request.user
        const {emailIds} = request.body
        markAsRead(user, emailIds).then(() => response.json({}))
    })
}

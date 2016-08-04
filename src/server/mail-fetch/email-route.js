const router = require('express').Router()

const {chain} = require('lodash/core')

const GoogleImapConnectionPool = require('../shared/utils/imap/google-imap-connection-pool')
const {emailToDto} = require('../shared/transformers')
const logger = require('../shared/utils/logger')

router.get('/unread', (request, response) => {
    const user = request.user
    fetchUnreadMessages(user)
        .then(emails => response.json(emails.map(emailToDto)))
        .catch(error => {
            const message = 'Error while fetching unread emails'
            logger.error(message, error)
            response.status(500).send(message)
        })
})

router.get('/:emailThreadId', (request, response) => {
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

router.post('/markasread', (request, response) => {
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

function establishConnection(user) {
    return GoogleImapConnectionPool.getConnection(user)
}

function fetchUnreadMessages(user) {
    return establishConnection(user)
        .then(connection => {
            return connection.getUnseenMessages(0, {includeBodies: true})
                .then(emails => {
                    GoogleImapConnectionPool.releaseConnection(user, connection)
                    return emails
                })
        })
}

function fetchFullThread(user, emailThreadId) {
    return establishConnection(user)
        .then(connection => {
            return connection.getThreadMessages(emailThreadId)
                .then(emails => {
                    GoogleImapConnectionPool.releaseConnection(user, connection)
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
            return connection.markAsRead(emailIds).then(() => GoogleImapConnectionPool.releaseConnection(user, connection))
        })
}

module.exports = router
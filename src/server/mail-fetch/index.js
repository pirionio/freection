const User = require('../shared/models/User')

const ImapConnectionPool = require('../shared/utils/imap/imap-connection-pool')
const logger = require('../shared/utils/logger')
const {emailToDto} = require('../shared/transformers')

function start(userId) {
    return getFullUser(userId)
        .then(createConnection)
        .then(fetchUnreadMessages)
}

function getFullUser(userId) {
    return User.get(userId).run()
}

function createConnection(user) {
    return ImapConnectionPool.getConnection(user)
        .then(connection => connection.connect())
        .catch(error => {
            logger.error(`error while connecting to mailbox of ${user.email}`, error)
            throw error
        })
}

function fetchUnreadMessages(connection) {
    return connection.getUnseenMessages(0, {
        includeBodies: false
    })
}

module.exports = app => {
    app.get('/emails/api/unread', (request, response) => {
        const user = request.user
        start(user.id).then(emails => response.json(emails.map(emailToDto)))
    })
}

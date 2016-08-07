const GoogleSmtpConnectionPool = require('../utils/smtp/google-smtp-connection-pool')

function sendEmail(user, to, subject, text, html) {
    return getConnection(user)
        .then(connection => {
            return connection.send(to, subject, text, html)
                .then(() => GoogleSmtpConnectionPool.releaseConnection(user, connection))
        })
}

function getConnection(user) {
    return GoogleSmtpConnectionPool.getConnection(user)
}

module.exports = {
    sendEmail
}
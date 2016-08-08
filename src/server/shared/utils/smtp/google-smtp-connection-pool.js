const ConnectionPool = require('../connection-pool/connection-pool')
const GoogleSmtpConnection = require('./google-smtp-connection')
const {SMTP} = require('../../constants')

class GoogleSmtpConnectionPool extends ConnectionPool {
    constructor() {
        super(createConnection, {
            maxAllowedIdleTime: SMTP.CONNECTION_ALLOWED_IDLE_MILLIS,
            maxRetries: SMTP.MAX_RETRIES
        })
    }
}

const pool = new GoogleSmtpConnectionPool()

function createConnection(user, accessToken) {
    return new GoogleSmtpConnection(user, accessToken)
}

function getConnection(user) {
    return pool.getConnection(user)
}

function closeConnection(user) {
    return pool.closeConnection(user)
}

function releaseConnection(user, connection) {
    return pool.releaseConnection(user, connection)
}

module.exports = {
    getConnection,
    closeConnection,
    releaseConnection
}

const ConnectionPool = require('../connection-pool/connection-pool')
const GoogleImapConnection = require('./google-imap-connection')
const {IMAP} = require('../../constants')

class GoogleImapConnectionPool extends ConnectionPool {
    constructor() {
        super(createConnection, {
            maxAllowedIdleTime: IMAP.CONNECTION_ALLOWED_IDLE_MILLIS,
            maxRetries: IMAP.MAX_RETRIES
        })
    }
}

const pool = new GoogleImapConnectionPool()

function createConnection(user, accessToken) {
    return new GoogleImapConnection(user, accessToken)
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

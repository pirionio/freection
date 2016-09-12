import ConnectionPool from '../connection-pool/connection-pool'
import GoogleImapConnection from './google-imap-connection'
import {IMAP} from '../../constants'
import logger from '../logger'

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

export function getConnection(user) {
    logger.info(`${user.email} request connection`)
    return pool.getConnection(user).then(connection => {
        logger.info(`${user.email} acquired connection`)
        return connection
    })
}

export function closeConnection(user) {
    return pool.closeConnection(user)
}

export function releaseConnection(user, connection) {
    logger.info(`${user.email} release connection`)
    return pool.releaseConnection(user, connection)
}

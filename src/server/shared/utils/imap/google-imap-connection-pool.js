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

let lastAction = ''

export function getConnection(user, action ='') {
    logger.info(`imap-pool ${user.email} request connection for ${action}`)
    return pool.getConnection(user).then(connection => {
        logger.info(`imap-pool ${user.email} acquired connection for ${action}`)
        lastAction = action
        return connection
    })
}

export function closeConnection(user) {
    return pool.closeConnection(user)
}

export function releaseConnection(user, connection) {
    logger.info(`imap-pool ${user.email} release connection ${lastAction}`)
    return pool.releaseConnection(user, connection)
}

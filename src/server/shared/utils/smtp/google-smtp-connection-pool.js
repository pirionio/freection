import ConnectionPool from '../connection-pool/connection-pool'
import GoogleSmtpConnection from './google-smtp-connection'
import {SMTP} from '../../constants'

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

export function getConnection(user) {
    return pool.getConnection(user)
}

export function closeConnection(user) {
    return pool.closeConnection(user)
}

export function releaseConnection(user, connection) {
    return pool.releaseConnection(user, connection)
}

const OAuth2 = require('google-auth-library/lib/auth/oauth2client')
const Pool = require('generic-pool').Pool
const autobind = require('class-autobind').default

const promisify = require('../promisify')
const logger = require('../logger')

const GoogleImapConnection = require('./google-imap-connection')
const config = require('../../config/google-oauth')
const {IMAP} = require('../../constants')

const User = require('../../models/User')

class ImapConnectionPool {
    constructor() {
        this.userConnectionPools = {}
        autobind(this)
    }

    getConnection(user) {
        return new Promise((resolve, reject) => {
            if (!this.userConnectionPools[user.id]) {
                this.userConnectionPools[user.id] = {
                    pool: this.createUserPool(user),
                    retries: 0
                }
            }

            const pool = this.userConnectionPools[user.id].pool
            pool.acquire((error, connection) => {
                if (error)
                    reject(error)
                else
                    resolve(connection)
            })
        })
    }

    createUserPool(user) {
        return new Pool({
            name: user.id,
            create: callback => {
                this.establishConnection(user).then(connection => callback(null, connection))
            },
            max: 1,
            idleTimeoutMillis: IMAP.CONNECTION_ALLOWED_IDLE_MILLIS
        })
    }

    establishConnection(user) {
        return this.getFullUser(user).then(fullUser => {
            return this.getNewAccessToken(fullUser).then(accessToken => this.createConnection(user, accessToken))
        })
    }

    createConnection(user, accessToken) {
        const connection = new GoogleImapConnection(accessToken, user.email)
        connection.onDisconnect(() => this.closeConnection(user, connection))
        return connection.connect()
            .then(() => {
                this.initRetries(user)
                return connection
            })
            .catch(error => this.retryConnecting(user, accessToken, error))
    }

    retryConnecting(user, accessToken, connectionError) {
        logger.error(`Error while creating IMAP connection for user ${user.email}`, connectionError)
        if (this.getNumOfTries(user) >= IMAP.MAX_RETRIES) {
            throw connectionError
        }

        this.addRetry(user)
        this.closeConnection(user, connection)
        return this.createConnection(user, accessToken)
    }

    getFullUser(user) {
        if (user.refreshToken)
            return Promise.resolve(user)
        else
            return User.get(user.id).run()
    }

    getNewAccessToken(user) {
        const oauth2 = new OAuth2(config.clientID, config.clientSecret)
        promisify(oauth2, ['getAccessToken'])
        oauth2.setCredentials({refresh_token: user.refreshToken})
        return oauth2.getAccessTokenAsync()
    }

    getNumOfTries(user) {
        return this.userConnectionPools[user.id] ? this.userConnectionPools[user.id].retries : 0
    }

    addRetry(user) {
        this.userConnectionPools[user.id].retries++
    }

    initRetries(user) {
        this.userConnectionPools[user.id].retries = 0
    }

    releaseConnection(user, connection) {
        const userPool = this.userConnectionPools[user.id]
        if (userPool && userPool.pool) {
            userPool.pool.release(connection)
        }
    }

    closeConnection(user, connection) {
        const userPool = this.userConnectionPools[user.id]
        if (userPool && userPool.pool) {
            userPool.pool.destroy(connection)
        }
    }
}

const pool = new ImapConnectionPool()

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
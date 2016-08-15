const OAuth2 = require('google-auth-library/lib/auth/oauth2client')
const Pool = require('generic-pool').Pool
const autobind = require('class-autobind').default
const forOwn = require('lodash/forOwn')

const promisify = require('../promisify')
const logger = require('../logger')

const config = require('../../config/google-oauth')

const User = require('../../models/User')

class ConnectionPool {
    constructor(connectionCreator, options) {
        this._connectionCreator = connectionCreator
        this._options = options
        this._userConnectionPools = {}

        autobind(this, ConnectionPool.prototype)

        this.registerDrainAll()
    }

    getConnection(user) {
        return new Promise((resolve, reject) => {
            if (!this._userConnectionPools[user.id]) {
                this._userConnectionPools[user.id] = {
                    pool: this.createUserPool(user),
                    retries: 0
                }
            }

            const pool = this._userConnectionPools[user.id].pool
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
            destroy: connection => {
                connection.close()
            },
            max: 1,
            idleTimeoutMillis: this._options.maxAllowedIdleTime
        })
    }

    establishConnection(user) {
        return this.getFullUser(user).then(fullUser => {
            return this.getNewAccessToken(fullUser).then(accessToken => this.createConnection(user, accessToken))
        })
    }

    createConnection(user, accessToken) {
        const connection = this._connectionCreator(user, accessToken)

        connection.onDisconnect && connection.onDisconnect(() => this.closeConnection(user, connection))

        return connection.connect()
            .then(() => {
                this.initRetries(user)
                return connection
            })
            .catch(error => this.retryConnecting(user, accessToken, connection, error))
    }

    retryConnecting(user, accessToken, connection, connectionError) {
        logger.error(`Error while creating IMAP connection for user ${user.email}`, connectionError)
        if (this.getNumOfTries(user) >= this._options.maxRetries) {
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
        return this._userConnectionPools[user.id] ? this._userConnectionPools[user.id].retries : 0
    }

    addRetry(user) {
        this._userConnectionPools[user.id].retries++
    }

    initRetries(user) {
        this._userConnectionPools[user.id].retries = 0
    }

    releaseConnection(user, connection) {
        const userPool = this._userConnectionPools[user.id]
        if (userPool && userPool.pool) {
            userPool.pool.release(connection)
        }
    }

    closeConnection(user, connection) {
        const userPool = this._userConnectionPools[user.id]
        if (userPool && userPool.pool) {
            userPool.pool.destroy(connection)
        }
    }

    drainAll() {
        forOwn(this._userConnectionPools, userPool => {
            userPool.pool && userPool.pool.drain(() => {
                userPool.pool.destroyAllNow()
            })
        })
    }

    registerDrainAll() {
        process.on('SIGTERM', () => {
            logger.info('Connection Pool - application got SIGTERM, gracefully destroying all connections')
            this.drainAll()
        })

        process.on('SIGINT', () => {
            logger.info('Connection Pool - application got SIGINT, gracefully destroying all connections')
            this.drainAll()
        })
    }
}

module.exports = ConnectionPool
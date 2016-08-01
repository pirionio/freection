const OAuth2 = require('google-auth-library/lib/auth/oauth2client')
const Pool = require('generic-pool').Pool

const promisify = require('../promisify')

const GoogleImapConnection = require('./google-imap-connection')
const config = require('../../config/google-oauth')

const User = require('../../models/User')

class ImapConnectionPool {
    constructor() {
        this.userToConnectionPoolMap = {}

        this.getConnection = this.getConnection.bind(this)
        this.createUserPool = this.createUserPool.bind(this)
        this.establishConnection = this.establishConnection.bind(this)
        this.createConnection = this.createConnection.bind(this)
        this.connect = this.connect.bind(this)
        this.getFullUser = this.getFullUser.bind(this)
        this.getNewAccessToken = this.getNewAccessToken.bind(this)
        this.closeConnection = this.closeConnection.bind(this)
    }

    getConnection(user) {
        return new Promise((resolve, reject) => {
            if (!this.userToConnectionPoolMap[user.id]) {
                this.userToConnectionPoolMap[user.id] = this.createUserPool(user)
            }

            const pool = this.userToConnectionPoolMap[user.id]
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
            idleTimeoutMillis: 1000 * 60 * 30
        })
    }

    establishConnection(user) {
        if (user.refreshToken) {
            return this.createConnection(user)
        }

        return this.getFullUser(user.id).then(this.createConnection)
    }

    createConnection(user) {
        return this.getNewAccessToken(user)
            .then(accessToken => new GoogleImapConnection(accessToken, user.email))
            .then(connection => {
                connection.onDisconnect(() => {
                    console.log('onDisconnect')
                    this.closeConnection(user, connection)
                })
                return connection
            })
            .then(connection => this.connect(user, connection))
    }

    connect(user, connection) {
        return connection.connect()
            .catch(error => {
                logger.error(`Error while connecting to imap of user ${user.email}:`, error)
                throw error
            })
    }

    getFullUser(userId) {
        return User.get(userId).run()
    }

    getNewAccessToken(user) {
        const oauth2 = new OAuth2(config.clientID, config.clientSecret)
        promisify(oauth2, ['getAccessToken'])
        oauth2.setCredentials({refresh_token: user.refreshToken})
        return oauth2.getAccessTokenAsync()
    }

    releaseConnection(user, connection) {
        const imapPool = this.userToConnectionPoolMap[user.id]
        if (imapPool) {
            imapPool.release(connection)
        }
    }

    closeConnection(user, connection) {
        const imapPool = this.userToConnectionPoolMap[user.id]
        if (imapPool) {
            imapPool.destroy(connection)
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
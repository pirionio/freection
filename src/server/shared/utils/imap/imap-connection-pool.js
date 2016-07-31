const OAuth2 = require('google-auth-library/lib/auth/oauth2client')
const promisify = require('../promisify')

const GoogleImapConnection = require('./google-imap-connection')
const config = require('../../config/google-oauth')

const User = require('../../models/User')

class ImapConnectionPool {
    constructor() {
        this.connectionsMap = {}

        this.getConnection = this.getConnection.bind(this)
        this.prepareConnection = this.prepareConnection.bind(this)
        this.createConnection = this.createConnection.bind(this)
        this.getFullUser = this.getFullUser.bind(this)
        this.getNewAccessToken = this.getNewAccessToken.bind(this)
        this.removeConnection = this.removeConnection.bind(this)
    }

    getConnection(user) {
        if (!this.connectionsMap[user.id]) {
            return this.prepareConnection(user)
                .then(connection => {
                    this.connectionsMap[user.id] = connection
                    return connection
                })
        }

        return Promise.resolve(this.connectionsMap[user.id])
    }

    prepareConnection(user) {
        if (user.refreshToken) {
            return this.getNewAccessToken(user).then(accessToken => this.createConnection(user, accessToken))
        }

        return this.getFullUser(user.id)
            .then(fullUser => this.getNewAccessToken(fullUser).then(accessToken => this.createConnection(fullUser, accessToken)))
    }

    createConnection(user, accessToken) {
        const connection = new GoogleImapConnection(accessToken, user.email)
        connection.onDisconnect(() => this.removeConnection(user))
        return connection
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

    removeConnection(user) {
        delete this.connectionsMap[user.id]
    }
}

const pool = new ImapConnectionPool()

function getConnection(user) {
    return pool.getConnection(user)
}

function removeConnection(user) {
    return pool.removeConnection(user)
}

module.exports = {
    getConnection,
    removeConnection
}
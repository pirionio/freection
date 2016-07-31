const OAuth2 = require('google-auth-library/lib/auth/oauth2client')
const promisify = require('../promisify')

const GoogleImapConnection = require('./google-imap-connection')
const config = require('../../config/google-oauth')

class ImapConnectionPool {
    constructor() {
        this.connectionsMap = {}

        this.getConnection = this.getConnection.bind(this)
        this.createConnection = this.createConnection.bind(this)
        this.getNewAccessToken = this.getNewAccessToken.bind(this)
        this.disconnect = this.disconnect.bind(this)
    }

    getConnection(user) {
        if (!this.connectionsMap[user.id]) {
            return this.createConnection(user)
                .then(connection => {
                    this.connectionsMap[user.id] = connection
                    return connection
                })
        }

        return Promise.resolve(this.connectionsMap[user.id])
    }

    createConnection(user) {
        return this.getNewAccessToken(user)
            .then(accessToken => {
                const connection = new GoogleImapConnection(accessToken, user.email)
                connection.onDisconnect(() => this.disconnect(user))
                return connection
            })
    }

    getNewAccessToken(user) {
        const oauth2 = new OAuth2(config.clientID, config.clientSecret)
        promisify(oauth2, ['getAccessToken'])
        oauth2.setCredentials({refresh_token: user.refreshToken})
        return oauth2.getAccessTokenAsync()
    }

    disconnect(user) {
        delete this.connectionsMap[user.id]
    }
}

const pool = new ImapConnectionPool()

function getConnection(user) {
    return pool.getConnection(user)
}

module.exports = {getConnection}
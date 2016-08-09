const NodeCache = require( "node-cache" )
const OAuth2 = require('google-auth-library/lib/auth/oauth2client')

const GoogleImapConnection = require('./google-imap-connection')
const config = require('../../config/google-oauth')
const promisify = require('../promisify')

const connectionCache = new NodeCache({ stdTTL: 30 * 60, useClones: false})

connectionCache.on('del', onDeleted)

function onDeleted(userId, connection) {
    connection.close()
}

function getConnection(user) {
    return connectionCache.get(user.id)
}

function createConnection(user) {
    return getNewAccessToken(user)
        .then(accessToken => {
            const connection = new GoogleImapConnection(user, accessToken)
            return connection.connect()
        })
        .then(connection => {
            const existConnection = getConnection(user)

            // kill existing connection is exist
            if (existConnection)
                connectionCache.del(user.id)

            connectionCache.set(user.id, connection)
            connection.onDisconnect(() => connectionCache.del(user.id))

            return connection
        })
}

function getNewAccessToken(user) {
    const oauth2 = new OAuth2(config.clientID, config.clientSecret)
    promisify(oauth2, ['getAccessToken'])
    oauth2.setCredentials({refresh_token: user.refreshToken})
    return oauth2.getAccessTokenAsync()
}

module.exports = {getConnection, createConnection}


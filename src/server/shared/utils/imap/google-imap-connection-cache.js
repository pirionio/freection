import NodeCache from 'node-cache'
import OAuth2 from 'google-auth-library/lib/auth/oauth2client'

import GoogleImapConnection from './google-imap-connection'
import config from '../../config/google-oauth'
import promisify from '../promisify'
import logger from '../logger'
import {registerCleanupCallback} from '../graceful-shutdown'

const connectionCache = new NodeCache({ stdTTL: 30 * 60, useClones: false})

connectionCache.on('del', onDeleted)

registerCleanupCallback(() => {
    logger.info('Connection Cache - application is shutting-down, gracefully destroying all connections')

    const keys = connectionCache.keys()
    const promises = keys.map(key => connectionCache.get(key).close())

    connectionCache.close()

    return Promise.all(promises)
        .then(() => logger.info('Connection Cache - closed'))
})

function onDeleted(email, connection) {
    logger.info(`connection cache - closing connection for ${email}`)
    connection.close()
}

export function resetTtl(user) {
    return connectionCache.ttl(user.email)
}

export function getConnection(user) {
    return connectionCache.get(user.email)
}

export function createConnection(user) {
    return getNewAccessToken(user)
        .then(accessToken => {
            const connection = new GoogleImapConnection(user, accessToken)
            return connection.connect()
        })
        .then(connection => {
            const existConnection = getConnection(user)

            // kill existing connection is exist
            if (existConnection)
                connectionCache.del(user.email)

            connectionCache.set(user.email, connection)
            connection.onDisconnect(() => connectionCache.del(user.email))

            return connection
        })
}

function getNewAccessToken(user) {
    const oauth2 = new OAuth2(config.clientID, config.clientSecret)
    promisify(oauth2, ['getAccessToken'])
    oauth2.setCredentials({refresh_token: user.refreshToken})
    return oauth2.getAccessTokenAsync()
}

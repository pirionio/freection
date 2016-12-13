import asana from 'asana'

import config from '../config/asana'

export function createClient(user) {
    const client = asana.Client.create({
        clientId: config.clientID,
        clientSecret: config.clientSecret,
        redirectUri: config.callbackURL
    })

    client.useOauth({
        credentials: {
            refresh_token: user.integrations.asana.refreshToken
        }
    })

    return client
}

export function createClientFromToken(accessToken) {
    const client = asana.Client.create()

    client.useOauth({
        credentials: {
            access_token: accessToken
        }
    })

    return client
}

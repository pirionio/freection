import querystring from 'querystring'

import config from '../config/google-oauth'
import logger from '../utils/logger'
import {User} from '../models'
import {createUserToken} from '../utils/token-creator'
import {createNewUser} from '../application/users-service.js'

export function generateOAuth2Url({prompt, hint, mobile=false, allowSendMail=false, callbackUrl=config.callbackURL} = {}) {
    const oauthUrl = 'https://accounts.google.com/o/oauth2/auth'

    const scope = [
        'profile',
        'email',
        'https://www.googleapis.com/auth/contacts.readonly'
    ]

    if (allowSendMail)
        scope.push('https://www.googleapis.com/auth/gmail.send')

    const options = Object.assign({
        response_type: 'code',
        client_id: config.clientID,
        callbackURL: callbackUrl,
        redirect_uri: callbackUrl,
        access_type: 'offline',
        scope: scope.join(' '),
        state: mobile ? 'mobile' : ''
    }, prompt ? { prompt } : {}, hint ? {login_hint: hint} : {})

    return `${oauthUrl}?${querystring.stringify(options)}`
}

export async function authenticateGoogle(accessToken, refreshToken, profile, callback) {
    const userData = {
        googleId: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        accessToken,
        refreshToken
    }

    let user

    try {
        try {
            user = await User.getUserByGoogleId(userData.googleId)

        } catch(getUserError) {
            if (getUserError !== 'NotFound')
                throw getUserError

            if (!userData.refreshToken) {
                handleMissingRefreshToken(userData, null, callback)
                return
            }

            user = await createNewUser(userData)
            logger.info(`new user ${user.firstName} ${user.lastName} ${user.email}`)
        }

        if (!user.refreshToken) {
            if (!userData.refreshToken) {
                handleMissingRefreshToken(userData, user, callback)
                return
            }

            user.refreshToken = userData.refreshToken
            user.accessToken = userData.accessToken
            user = await user.save()
        }

        // We probably requested more permissions, so updating the scopes
        if (userData.refreshToken) {
            user.refreshToken = userData.refreshToken
            user.accessToken = userData.accessToken
            user = await user.save()
        }

        if (!user.accessToken) {
            user.accessToken = userData.accessToken
            user = await user.save()
        }

        const token = createUserToken(user)
        callback(null, token)
    } catch(error) {
        callback(error)
    }
}

function handleMissingRefreshToken(userData, user, callback) {
    logger.info(`missing refresh token for new user ${userData.firstName} ${userData.lastName} ${userData.email}`)
    callback(null, {
        missingRefreshToken: true,
        email: userData.email,
        allowSendGmail: user && user.integrations && user.integrations.gmail && user.integrations.gmail.allowSendMail
    })
}
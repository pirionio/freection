import querystring from 'querystring'

import {Router} from 'express'
import passport from 'passport'
import {Strategy as GoogleStrategy} from 'passport-google-oauth20'

import {User} from '../shared/models'
import config from '../shared/config/google-oauth'
import token from '../shared/utils/token-strategy'
import logger from '../shared/utils/logger'
import {createUserToken} from '../shared/utils/token-creator'
import {createNewUser} from '../shared/application/users-service.js'

const router = Router()

function generateOAuth2Url({prompt, hint, mobile=false} = {}) {
    const oauthUrl = 'https://accounts.google.com/o/oauth2/auth'
    const scope = [
        'profile',
        'email',
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/contacts.readonly']

    const options = Object.assign({
        response_type: 'code',
        client_id: config.clientID,
        redirect_uri: config.callbackURL,
        access_type: 'offline',
        scope: scope.join(' '),
        state: mobile ? 'mobile' : ''
    }, prompt ? { prompt } : {}, hint ? {login_hint: hint} : {})

    return `${oauthUrl}?${querystring.stringify(options)}`
}

passport.use(new GoogleStrategy({
    clientID: config.clientID,
    clientSecret: config.clientSecret,
    callbackURL: config.callbackURL
}, (accessToken, refreshToken, profile, cb) => {

    const userData = {
        googleId: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        accessToken,
        refreshToken
    }

    User.getUserByGoogleId(userData.googleId)
        .catch(e => {
            if (e !== 'NotFound')
                throw e

            if (!userData.refreshToken)
                throw 'MissingRefreshToken'

            return createNewUser(userData)
                .then(user => {
                    logger.info(`new user ${user.firstName} ${user.lastName} ${user.email}`)
                    return user
                })
        })
        .then(user => {
            if (!user.refreshToken) {
                if (!userData.refreshToken)
                    throw 'MissingRefreshToken'

                user.refreshToken = userData.refreshToken
                user.accessToken = userData.accessToken
                return user.save()
            }

            // We probably requested more permissions, so updating the scopes
            if (userData.refreshToken) {
                user.refreshToken = userData.refreshToken
                user.accessToken = userData.accessToken
                return user.save()
            }

            if (!user.accessToken) {
                user.accessToken = userData.accessToken
                return user.save()
            }

            return user
        })
        .then(user => cb(null, createUserToken(user)))
        .catch(err => {
            if (err === 'MissingRefreshToken') {
                logger.info(
                    `missing refresh token for new user ${userData.firstName} ${userData.lastName} ${userData.email}`)
                cb(null, {missingRefreshToken:true, email: userData.email})
            } else {
                cb(err)
            }
        })
}))

router.get('/logout', token.logout({redirect: '/'}))

router.get('/google', (request, response) => {
    const {hint} = request.query

    const redirectUrl = generateOAuth2Url(hint ? {hint} : {})
    response.redirect(302, redirectUrl)
})

router.get('/google/mobile', (request, response) => {
    const {hint} = request.query

    const redirectUrl = generateOAuth2Url(Object.assign({mobile:true}, hint ? {hint} : {}))
    response.redirect(302, redirectUrl)
})

router.get('/google/callback',
    passport.authenticate('google', {session: false, failureRedirect: '/login'}), (request, response, next) => {
        const {state} = request.query

        if (request.user.missingRefreshToken) {
            const redirectUrl = generateOAuth2Url({
                prompt: 'consent',
                hint: request.user.email
            })
            response.redirect(302, redirectUrl)
        } else {
            const redirect = state === 'mobile' ? '/mobile' : '/'

            token.login({ redirect, expiresIn: '30 days' })(request, response, next)
        }
    })

export default router
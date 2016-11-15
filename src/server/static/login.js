import {Router} from 'express'
import passport from 'passport'

import token from '../shared/utils/token-strategy'
import googleConfig from '../shared/config/google-oauth'
import {generateOAuth2Url} from '../shared/technical/google-service'

const router = Router()

router.get('/logout', token.logout({redirect: '/'}))

router.get('/google', (request, response) => {
    const {hint} = request.query
    const redirectUrl = generateOAuth2Url(hint ? {hint} : {})
    response.redirect(302, redirectUrl)
})

router.get('/google/mobile', (request, response) => {
    const {hint} = request.query
    const redirectUrl = generateOAuth2Url(Object.assign({mobile: true}, hint ? {hint} : {}))
    response.redirect(302, redirectUrl)
})

router.get('/google/callback',
    passport.authenticate('google', {session: false, callbackURL: googleConfig.callbackURL, failureRedirect: '/login'}),
    (request, response, next) => {
        const {state} = request.query

        if (request.user.missingRefreshToken) {
            const redirectUrl = generateOAuth2Url({
                prompt: 'consent',
                hint: request.user.email,
                allowSendMail: request.user.allowSendGmail
            })
            response.redirect(302, redirectUrl)
        } else {
            const redirect = state ? `/${state}` : '/'
            token.login({redirect, expiresIn: '30 days'})(request, response, next)
        }
    })

export default router
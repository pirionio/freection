import {Router} from 'express'
import passport from 'passport'
import isUndefined from 'lodash/isUndefined'

import GeneralConfig from '../../shared/config/general'
import token from '../../shared/utils/token-strategy'
import {User} from '../../shared/models'
import {generateOAuth2Url} from '../../shared/technical/google-service'

const router = Router()

const sendPermissionCallbackUrl = `${GeneralConfig.BASE_URL}/api/google/sendpermission/callback`
const finalRedirectPath = '/integrations/gmail'

router.get('/sendpermission', setSendPermission)

// We must use the passport strategy for google here, in order to verify that the user authenticated successfully with the new permissions (scopes).
router.get('/sendpermission/callback',
    passport.authenticate('google', {session: false, callbackURL: sendPermissionCallbackUrl, failureRedirect: finalRedirectPath}),
    setSendPermissionCallback
)

async function setSendPermission(request, response, next) {
    if (isUndefined(request.query.permission))
        response.status(400).send('Permission must be provided')

    const userToken = request.user
    const allowSendMail = getPermissionFromRequest(request, false)

    try {
        if (allowSendMail) {
            const redirectUrl = generateOAuth2Url({
                prompt: 'consent',
                hint: userToken.email,
                allowSendMail: true,
                callbackUrl: sendPermissionCallbackUrl
            })
            response.redirect(302, redirectUrl)
        } else {
            // In this case, we'd only change the DB, and re-sign the token so that the client is affected with the new user information.
            setSendPermissionCallback(request, response, next)
        }
    } catch (error) {
        logger.error(`Could not set Gmail send permission to ${allowSendMail} for user ${userToken.email}`, error)
        response.status(500).send(`Could not set Gmail send permission to ${allowSendMail}`)
    }
}

async function setSendPermissionCallback(request, response, next) {
    const allowSendMail = getPermissionFromRequest(request, true)
    await updateUserGmailPermissions(request.user.id, allowSendMail)

    // It's crucial to change the token object here, so that the token strategy will sign the correct user data.
    request.user.allowSendGmail = allowSendMail

    token.login({redirect: finalRedirectPath, expiresIn: '30 days'})(request, response, next)
}

async function updateUserGmailPermissions(userId, allowSendMail) {
    return await User.get(userId).update({integrations: {gmail: {allowSendMail}}})
}

function getPermissionFromRequest(request, defaultValue) {
    return request.query.permission ?
        (request.query.permission === 'true' || request.query.permission === '1') :
        defaultValue
}

export default router
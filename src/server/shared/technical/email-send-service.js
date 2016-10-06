//import * as GoogleSmtpConnectionPool from '../utils/smtp/google-smtp-connection-pool'
import google from 'googleapis'
import mailcomposer from 'mailcomposer'
import base64url from 'base64url'
import htmlToText from 'html-to-text'

import {User} from '../models'
import config from '../config/google-oauth'
import promisify from '../utils/promisify.js'

const OAuth2 = google.auth.OAuth2
const gmail = google.gmail('v1')
promisify(gmail.users.messages, ['send'])

async function getFullUser(user) {
    if (user.refreshToken)
        return user

    return await User.get(user.id).run()
}

async function getAuth(user) {
    const oauth2 = new OAuth2(config.clientID, config.clientSecret)
    promisify(oauth2, ['getAccessToken'])
    oauth2.setCredentials({refresh_token: user.refreshToken})
    await oauth2.getAccessTokenAsync()
    return oauth2
}

async function getRaw(message) {
    const mail = mailcomposer(message)
    promisify(mail, ['build'])

    return base64url(await mail.buildAsync())
}

async function gmailSend(auth, raw) {
    await gmail.users.messages.sendAsync({
        userId: 'me',
        auth: auth,
        resource: {
            raw
        }
    })
}

export async function sendMessage(user, message) {

    const withText = message.text ? message : Object.assign({}, message, {
        text: htmlToText.fromString(message.html)
    })

    const raw = await getRaw(withText)
    const fullUser = await getFullUser(user)
    const auth = await getAuth(fullUser)
    await gmailSend(auth, raw)
}
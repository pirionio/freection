//import * as GoogleSmtpConnectionPool from '../utils/smtp/google-smtp-connection-pool'
import google from 'googleapis'
import mailcomposer from 'mailcomposer'
import base64url from 'base64url'
import htmlToText from 'html-to-text'
import MailgunApi from 'mailgun-js'

import {User} from '../models'
import config from '../config/google-oauth'
import promisify from '../utils/promisify.js'
import {replyToAddress, mailgunApiKey, mailgunDomain} from '../config/email'

const OAuth2 = google.auth.OAuth2
const gmail = google.gmail('v1')
promisify(gmail.users.messages, ['send'])

const mailgun = MailgunApi({apiKey: mailgunApiKey, domain: mailgunDomain})

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

async function mailgunSend(message) {
    const mailgunMessage = Object.assign({}, message, {
        'h:Reply-To': message.replyTo,
        'h:In-Reply-To': message.inReplyTo,
    })

    return mailgun.messages().send(mailgunMessage)
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
    const fullUser = await getFullUser(user)
    const allowSendGmail = fullUser && fullUser.integrations && fullUser.integrations.gmail && fullUser.integrations.gmail.allowSendMail

    const messageWithText = message.text ? message : Object.assign({}, message, {
        text: htmlToText.fromString(message.html)
    })

    const messageWithFrom = messageWithText.from ? messageWithText : Object.assign({}, message, {
        from: `"${user.firstName} ${user.lastName}" <${allowSendGmail ? user.email : replyToAddress}>`
    })

    if (allowSendGmail) {
        const raw = await getRaw(messageWithFrom)
        const auth = await getAuth(fullUser)
        await gmailSend(auth, raw)
    } else {
        await mailgunSend(messageWithFrom)
    }

}
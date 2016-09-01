var nodemailer = require('nodemailer')
var htmlToText = require('nodemailer-html-to-text').htmlToText
const autobind = require('class-autobind').default

const promisify = require('../promisify')

export default class SmtpConnection {
    constructor(user, options) {
        this._transport = nodemailer.createTransport({
            service: options.service,
            auth: {
                user: user.email,
                xoauth2: options.accessToken
            }
        })
        this._transport.use('compile', htmlToText())

        this._user = user
        this._onDisconnect = null

        promisify(this._transport, ['sendMail'])
        autobind(this, SmtpConnection.prototype)
    }

    connect() {
        return Promise.resolve(this._transport)
    }

    send(to, subject, messageText, messageHtml, messageId) {
        return this._transport.sendMailAsync({
            from: createFromAddress(this._user),
            to,
            subject,
            text: messageText,
            html: messageHtml,
            messageId
        })
    }

    replyToAll(to, inReplyTo, references, subject, messageText, messageHtml) {
        return this._transport.sendMailAsync({
            from: createFromAddress(this._user),
            to,
            inReplyTo,
            references,
            subject,
            text: messageText,
            html: messageHtml
        })
    }

    close() {
        return this._transport.close()
    }
}

function createFromAddress(user) {
    return `${user.firstName} ${user.lastName} <${user.email}>`
}
var nodemailer = require('nodemailer')
var htmlToText = require('nodemailer-html-to-text').htmlToText
const autobind = require('class-autobind').default

const logger = require('../logger')
const promisify = require('../promisify')

const config = require('../../config/google-oauth')

class SmtpConnection {
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

    replyToAll(to, inReplyTo, subject, messageText, messageHtml) {
        return this._transport.sendMailAsync({
            from: createFromAddress(this._user),
            to,
            inReplyTo,
            subject: createReplySubject(subject),
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

function createReplySubject(subject) {
    return subject.toLowerCase().startsWith('re:') ?
        subject :
        `Re: ${subject}`
}

module.exports = SmtpConnection
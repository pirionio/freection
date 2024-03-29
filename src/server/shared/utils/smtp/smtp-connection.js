import nodemailer from 'nodemailer'
import {htmlToText} from 'nodemailer-html-to-text'
import autobind from 'class-autobind'

import promisify from '../promisify'

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

    sendMessage(message) {
        const messageWithFrom = message.from ? message : Object.assign({}, message, {
            from: createFromAddress(this._user)
        })

        return this._transport.sendMailAsync(messageWithFrom)
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
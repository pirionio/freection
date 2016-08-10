const imap = require('imap')
const {MailParser} = require('mailparser')
const {chain, compact} = require('lodash')
const autobind = require('class-autobind').default

const logger = require('../logger')
const promisify = require('../promisify')
const {IMAP} = require('../../constants')

class ImapConnection {
    constructor(type, options) {
        this._type = type
        this._connection = new imap(options)
        this._onDisconnect = null

        promisify(this._connection, ['openBox', 'closeBox', 'search', 'setFlags'])
        autobind(this, ImapConnection.prototype)
    }

    connect() {
        return new Promise((resolve, reject) => {
            this._connection.once('ready', () => {
                this._connection.openBoxAsync(IMAP[this._type].ALL_MAILBOX)
                    .then(() => resolve(this))
                    .catch(error => reject(error))
            })

            this._connection.once('error', error => reject(error))

            this._connection.once('end', () => {
                this._onDisconnect && this._onDisconnect(this._connection)
            })

            this._connection.connect()
        })
    }

    close() {
        return this._connection.closeBoxAsync()
    }

    onDisconnect(callback) {
        this._onDisconnect = callback
    }

    onMail(callback) {
        this._connection.on('mail', callback)
    }

    parseRawMessage(rawMessage, options) {
        return new Promise((resolve, reject) => {
            const message = {}
            const parser = new MailParser()

            parser.once('end', mail => {
                message.body = mail.text
                message.html = mail.html
                resolve(message)
            })

            rawMessage.once('attributes', attributes => {
                const {envelope} = attributes

                message.header = {
                    uid: attributes.uid,
                    subject: envelope.subject,
                    date: new Date(envelope.date),
                    from: chain(envelope.from).map(from => this.convertEnvelopeUser(from)).head().value(),
                    to: envelope.to ? envelope.to.map(to => this.convertEnvelopeUser(to)) : [],
                    messageId: envelope.messageId,
                    gmailId: attributes['x-gm-msgid'],
                    gmailThreadId: attributes['x-gm-thrid']
                }
            })

            if (options.includeBodies) {
                rawMessage.on('body', (stream, info) => {
                    stream.on('data', chunk => {
                        parser.write(chunk)
                    })
                }) 
            }

            rawMessage.once('end', () => {
                options.includeBodies ? parser.end() : resolve(message)
            })
        })
    }

    fetchByUids(uids, options) {
        return new Promise((resolve, reject) => {
            const promises = []

            if (uids.length == 0) {
                resolve([])
                return
            }

            const fetch = this._connection.fetch(uids, {
                envelope: true,
                bodies: [options.includeBodies ? '' : 'HEADER']
            })

            fetch.on('message', rawMessage => {
                const promise = this.parseRawMessage(rawMessage, options)
                promises.push(promise)
            })
            fetch.once('end', () => {
                Promise.all(promises).then(messages => resolve(messages))
            })
            fetch.once('error', error => reject(error))
        })
    }

    getUnseenMessages(since, options = {}) {
        const criteria = compact(['UNSEEN', [IMAP[this._type].LABEL_FIELD, 'Inbox'], since > 0 ? ['UID', ` ${since+1}:*`] : null])
        return this._connection.searchAsync(criteria)
            .then(results => this.fetchByUids(results, options))
            .catch(error => {
                logger.error(`Could not find unread emails since UID ${since}`, error)
                throw error
            })
    }
    
    getThreadMessages(threadId) {
        const criteria = ['ALL', [IMAP[this._type].THREAD_FIELD, threadId]]
        return this._connection.searchAsync(criteria)
            .then(results => {
                return this.fetchByUids(results, {includeBodies: true})
            })
            .catch(error => {
                logger.error(`Could not find thread ${threadId}`, error)
                throw error
            })
    }

    getEmailById(emailId) {
        const criteria = [['HEADER', 'Message-ID', emailId]]
        return this._connection.searchAsync(criteria)
            .then(results => {
                return this.fetchByUids(results, {})
            })
            .then(emails => {
                if (emails && emails.length > 0)
                    return emails[0]
                else
                    throw 'NotFound'
            })
    }

    markAsRead(emailUids) {
        return this._connection.setFlagsAsync(emailUids, IMAP[this._type].SEEN_FLAG)
            .catch(error => {
                logger.error('Could not mark emails as read', error)
                throw error
            })
    }

    convertEnvelopeUser(user) {
        return {
            username: user.mailbox,
            name: user.name,
            organization: user.host
        }
    }
}

module.exports = ImapConnection
const imap = require('imap')
const {MailParser} = require('mailparser')
const {chain, compact} = require('lodash')

const logger = require('../logger')
const promisify = require('../promisify')

class ImapConnection {
    constructor(config) {
        this._connection = new imap(config)
        promisify(this._connection, ['openBox', 'search'])
    }

    connect() {
        return new Promise((resolve, reject) => {
            this._connection.once('ready', () => {
                this._connection.openBoxAsync('INBOX', true)
                    .then(() => resolve(this))
                    .catch(error => reject(error))
            })

            this._connection.once('error', error => reject(error))

            this._connection.connect()
        })
    }

    onDisconnect(callback) {
        this._connection && this._connection.once('end', () => callback(this))
    }

    parseRawMessage(rawMessage, options) {
        return new Promise((resolve, reject) => {
            const message = {}
            const parser = new MailParser()

            parser.once('end', mail => {
                message.body = mail.text
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

    getUnseenMessages(since, options = {}) {
        return new Promise((resolve, reject) => {
            const promises = []

            const criteria = compact(['UNSEEN', since > 0 ? ['UID', ` ${since+1}:*`] : null])

            this._connection.searchAsync(criteria)
                .then(results => {
                    if (results.length == 0) {
                        resolve([])
                    } else {
                        const fetch = this._connection.fetch(results, {
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
                    }
                })
                .catch(err => {
                    console.log(err)
                    throw err
                })
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
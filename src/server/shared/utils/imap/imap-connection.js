import imap from 'imap'
import {MailParser} from 'mailparser'
import {chain} from 'lodash'
import autobind from 'class-autobind'
import converter from 'hex2dec'

import logger from '../logger'
import promisify from '../promisify'
import {IMAP} from '../../constants'

export default class ImapConnection {
    constructor(type, options) {
        this._type = type
        this._connection = new imap(options)
        this._onDisconnect = null

        promisify(this._connection, ['openBox', 'closeBox', 'search', 'setFlags', 'addKeywords', 'getBoxes', 'expunge', 'move'])
        autobind(this, ImapConnection.prototype)
    }

    connect() {
        return new Promise((resolve, reject) => {
            this._connection.once('ready', () => {
                this._connection.getBoxesAsync()
                    .then(boxes => {

                        // This is very gmail behavior, we should probably seek other solution for other providers
                        const mainBox = boxes[IMAP[this._type].MAIN_BOX]

                        const allMailName = chain(mainBox.children)
                            .toPairs()
                            .filter(box => box[1].attribs && box[1].attribs.includes(IMAP[this._type].ALL_ATTRIBUTE))
                            .map(box => box[0])
                            .head()
                            .value()

                        return `${IMAP[this._type].MAIN_BOX}/${allMailName}`
                    })
                    .then(mailBoxName => this._connection.openBoxAsync(mailBoxName))
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

    onUpdate(callback) {
        this._connection.on('update', callback)
    }

    parseRawMessage(rawMessage, options) {
        return new Promise(resolve => {
            const message = {}
            const parser = new MailParser()

            parser.once('end', mail => {
                if (mail.references) {
                    message.references = mail.references
                }

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
                    internalDate: attributes.date,
                    from: chain(envelope.from).map(from => this.convertEnvelopeUser(from)).head().value(),
                    to: envelope.to ? envelope.to.map(to => this.convertEnvelopeUser(to)) : [],
                    messageId: envelope.messageId,
                    gmailId: attributes['x-gm-msgid'],
                    gmailThreadId: attributes['x-gm-thrid'],
                    gmailThreadIdHex: converter.decToHex(attributes['x-gm-thrid'])
                }
            })

            if (options.includeBodies) {
                rawMessage.on('body', stream => {
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

            if (uids.length === 0) {
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

    getUnseenMessages(joinDate) {
        let criteria

        if (joinDate) {
            const criteriaAfter = ['SINCE', joinDate]
            const criteriaBefore = ['AND', ['BEFORE', joinDate], 'UNSEEN']

            criteria = [[IMAP[this._type].LABEL_FIELD, 'Inbox'], ['UNKEYWORD', 'FreectionDiscard'], ['OR', criteriaAfter, criteriaBefore]]
        } else {
            criteria = [[IMAP[this._type].LABEL_FIELD, 'Inbox'], ['UNKEYWORD', 'FreectionDiscard']]
        }

        return this._connection.searchAsync(criteria)
            .then(results => this.fetchByUids(results, {includeBodies: true}))
            .catch(error => {
                logger.error('Could not find unread emails', error)
                throw error
            })
    }
    
    getThreadMessages(threadId) {
        const criteria = ['ALL', [IMAP[this._type].THREAD_FIELD, threadId]]
        logger.info('imap getting thread, criteria:', criteria)
        return this._connection.searchAsync(criteria)
            .then(results => {
                logger.info('imap results:', results)
                return this.fetchByUids(results, {includeBodies: true})
            })
            .catch(error => {
                logger.error(`Could not find thread ${threadId}`, error)
                throw error
            })
    }

    getLastEmail() {
        const criteria = [['UID', '*']]
        return this._connection.searchAsync(criteria)
            .then(results => {
                return this.fetchByUids(results, {})
            })
            .then(emails => {
                if (emails && emails.length > 0)
                    return emails[0]

                throw 'NotFound'
            })
    }

    getEmailsSince(internalDate) {
        const criteria = [['SINCE', internalDate]]
        return this._connection.searchAsync(criteria)
            .then(results => {
                return this.fetchByUids(results, {includeBodies: true})
            })
    }

    markAsReadByMessageId(messageId) {
        const criteria = [['HEADER', 'Message-ID', messageId]]
        return this._connection.searchAsync(criteria)
            .then(results => {
                if (results && results.length)
                    this.markAsRead(results)
            })
    }

    markAsRead(emailUids) {
        return this._connection.addKeywordsAsync(emailUids, 'FreectionDiscard')
            .catch(error => {
                logger.error('Could not mark emails as read', error)
                throw error
            })

        /*return this._connection.setFlagsAsync(emailUids, IMAP[this._type].SEEN_FLAG)
            .catch(error => {
                logger.error('Could not mark emails as read', error)
                throw error
            })*/
    }

    deleteAllEmails() {
        const criteria = ['ALL']
        return this._connection.searchAsync(criteria)
            .then(results => {
                if (results && results.length)
                    return this._connection.moveAsync(results, `${IMAP[this._type].MAIN_BOX}/Trash`)
            })
            .catch(error => {
                logger.error('Could not delete all emails', error)
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
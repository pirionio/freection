const {chain, some} = require('lodash/core')

const GoogleImapConnectionPool = require('../utils/imap/google-imap-connection-pool')
const GoogleSmtpConnectionPool = require('../utils/smtp/google-smtp-connection-pool')
const EntityTypes = require('../../../common/enums/entity-types')
const ThingStatus = require('../../../common/enums/thing-status')
const {Thing} = require('../models')
const EventsCreator = require('./event-creator')
const {userToAddress} = require('./address-creator')
const {imapEmailToDto} = require('../application/transformers')

function filterThingMessage(user, message) {
    const domain = user.email.substring(user.email.indexOf('@'))

    if (message.references && some(message.references, reference => reference.startsWith('thing/') && reference.endsWith(domain))) {
        return false
    }

    return true
}

function fetchUnreadMessages(user) {
    return getImapConnection(user)
        .then(connection => {
            return connection.getUnseenMessages(0, {includeBodies: true})
                .then(emails => {
                    GoogleImapConnectionPool.releaseConnection(user, connection)
                    return emails.filter(message => filterThingMessage(user, message))
                        .map(email=> imapEmailToDto(email, user))
                })
        })
}

function getEmailsSince(user, internalDate) {
    return getImapConnection(user)
        .then(connection => {
            return connection.getEmailsSince(internalDate)
                .then(emails => {
                    GoogleImapConnectionPool.releaseConnection(user, connection)
                    return emails.map(email => imapEmailToDto(email, user))
                })
        })
}

function fetchFullThread(user, emailThreadId) {
    return getImapConnection(user)
        .then(connection => {
            return connection.getThreadMessages(emailThreadId)
                .then(emails => {
                    GoogleImapConnectionPool.releaseConnection(user, connection)
                    return emails
                })
        })
        .then(emails => prepareThread(emails, user))
}

function getLastInternalDate(user) {
    return getImapConnection(user)
        .then(connection => {
            return connection.getLastEmail()
                .then(email => {
                    GoogleImapConnectionPool.releaseConnection(user, connection)
                    return email.header.internalDate
                })
                .catch(error => {
                    GoogleImapConnectionPool.releaseConnection(user, connection)
                    throw error
                })
        })
}

function markAsRead(user, emailUids) {
    return getImapConnection(user)
        .then(connection => {
            return connection.markAsRead(emailUids).then(() => GoogleImapConnectionPool.releaseConnection(user, connection))
        })
}

function sendEmail(user, to, subject, text, html, messageId) {
    return getSmtpConnection(user)
        .then(connection => {
            return connection.send(to, subject, text, html, messageId)
                .then(email => {
                    GoogleSmtpConnectionPool.releaseConnection(user, connection)
                    return smtpEmailToDto(email, user, subject, text, html)
                })
                .catch(error => {
                    GoogleSmtpConnectionPool.releaseConnection(user, connection)
                    throw error
                })
        })
}

function sendEmailForThing(user, to, subject, body, messageId) {
    const emailForThingHtml = getEmailForThingHtml(user, body)
    return sendEmail(user, to, subject, undefined, emailForThingHtml, messageId)
}

function doEmail(user, emailThreadId) {
    return fetchFullThread(user, emailThreadId)
        .then(thread => {
            const creator = thread.creator

            const comments = thread.messages.map(message => {
                return {
                    html: message.payload.html,
                    text: message.payload.text
                }
            })

            return saveNewThing(thread.subject, creator, userToAddress(user), thread.id, thread.payload.threadId).
                then(thing => {
                    EventsCreator.createCreated(creator, thing, getShowNewList)
                        .then(() => EventsCreator.createAccepted(userToAddress(user), thing, getShowNewList))
                        .then(() => comments.map(
                            comment => EventsCreator.createComment(creator, thing, getShowNewList, comment.text,
                                comment.html, comment.header.messageId)))
                        .then(all => Promise.all(all))

            })
        })
}

function replyToAll(user, to, inReplyTo, references, subject, messageText, messageHtml) {
    return getSmtpConnection(user)
        .then(connection => {
            return connection.replyToAll(to, inReplyTo, references, subject, messageText, messageHtml)
                .then(result => {
                    GoogleSmtpConnectionPool.releaseConnection(user, connection)
                    return smtpEmailToDto(result, user, subject, messageText, messageHtml)
                })
                .catch(error => {
                    GoogleSmtpConnectionPool.releaseConnection(user, connection)
                    throw error
                })
        })
}

function prepareThread(emails, user) {
    const firstEmail = chain(emails).sortBy('header.date').head().value()
    return Object.assign(imapEmailToDto(firstEmail, user), {
        id: firstEmail.payload ? firstEmail.payload.threadId : firstEmail.id,
        messages: emails.map(email => imapEmailToDto(email, user))
    })
}

function saveNewThing(subject, creator, to, emailId, threadId) {
    return Thing.save({
        createdAt: new Date(),
        creator,
        to,
        body: null,
        subject,
        followUpers: [],
        doers: [to.id],
        type: EntityTypes.EMAIL_THING.key,
        payload: {
            emailId,
            threadId,
            status: ThingStatus.INPROGRESS.key
        }
    })
}

function getShowNewList() {
    return []
}

function smtpEmailToDto(email, user, subject, text, html) {
    return {
        id: email.messageId,
        creator: userToAddress(user),
        to: email.to,
        subject,
        payload: {
            text,
            html,
            isRead: true
        },
        type: EntityTypes.EMAIL,
        createdAt: new Date()
    }
}

function getEmailForThingHtml(user, body) {
    return `<div>
                <div>${body}</div><br>
                <span>
                    ${user.firstName} ${user.lastName} is using Freection.
                    If you want to let ${user.firstName} know that's going on with this thing, try Freection 
                    <a href="https://freection.com" target="_blank">here!</a>
                </span>
            </div>`
}

function getImapConnection(user) {
    return GoogleImapConnectionPool.getConnection(user)
}

function getSmtpConnection(user) {
    return GoogleSmtpConnectionPool.getConnection(user)
}

module.exports = {
    fetchUnreadMessages,
    fetchFullThread,
    markAsRead,
    sendEmail,
    sendEmailForThing,
    doEmail,
    replyToAll,
    getEmailsSince,
    getLastInternalDate
}
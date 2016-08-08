const {chain} = require('lodash/core')

const GoogleImapConnectionPool = require('../utils/imap/google-imap-connection-pool')
const GoogleSmtpConnectionPool = require('../utils/smtp/google-smtp-connection-pool')
const EntityTypes = require('../../../common/enums/entity-types')
const ThingStatus = require('../../../common/enums/thing-status')
const {Thing} = require('../models')
const EventsCreator = require('./event-creator')
const {userToAddress} = require('./address-creator')
const {imapEmailToDto} = require('../application/transformers')

function fetchUnreadMessages(user) {
    return getImapConnection(user)
        .then(connection => {
            return connection.getUnseenMessages(0, {includeBodies: true})
                .then(emails => {
                    GoogleImapConnectionPool.releaseConnection(user, connection)
                    return emails.map(imapEmailToDto)
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
        .then(prepareThread)
}

function markAsRead(user, emailUids) {
    return getImapConnection(user)
        .then(connection => {
            return connection.markAsRead(emailUids).then(() => GoogleImapConnectionPool.releaseConnection(user, connection))
        })
}

function sendEmail(user, to, subject, text, html) {
    return getSmtpConnection(user)
        .then(connection => {
            return connection.send(to, subject, text, html)
                .then(email => {
                    GoogleSmtpConnectionPool.releaseConnection(user, connection)
                    return smtpEmailToDto(email, user, subject, text, html)
                })
        })
}

function sendEmailForThing(user, to, subject, body) {
    const emailForThingHtml = getEmailForThingHtml(user, body)
    return sendEmail(user, to, subject, undefined, emailForThingHtml)
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
                            comment => EventsCreator.createComment(creator, thing, getShowNewList, comment.text, comment.html)))
                        .then(all => Promise.all(all))

            })
        })
}

function replyToAll(user, to, inReplyTo, subject, messageText, messageHtml) {
    return getSmtpConnection(user)
        .then(connection => {
            return connection.replyToAll(to, inReplyTo, subject, messageText, messageHtml)
                .then(result => {
                    GoogleSmtpConnectionPool.releaseConnection(user, connection)
                    return smtpEmailToDto(result, user, subject, messageText, messageHtml)
                })
        })
}

function prepareThread(emails) {
    const firstEmail = chain(emails).sortBy('header.date').head().value()
    const threadDto = imapEmailToDto(firstEmail)
    threadDto.messages = emails.map(imapEmailToDto)
    return threadDto
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
    replyToAll
}
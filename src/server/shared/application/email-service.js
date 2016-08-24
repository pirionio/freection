const {chain, some, isUndefined} = require('lodash/core')

const GoogleImapConnectionPool = require('../utils/imap/google-imap-connection-pool')
const GoogleSmtpConnectionPool = require('../utils/smtp/google-smtp-connection-pool')
const EntityTypes = require('../../../common/enums/entity-types')
const ThingStatus = require('../../../common/enums/thing-status')
const {Thing, User} = require('../models')
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

async function fetchUnreadMessages(user) {
    const fullUser = await User.get(user.id).run()

    if (isUndefined(fullUser.imapJoinDate)) {
        try {
            fullUser.imapJoinDate = await getLastInternalDate(user)
        } catch(error) {
            if (error !== 'NotFound') {
                // TODO: does rethink db saves nulls?
                fullUser.imapJoinDate = null
            }
        }

        await fullUser.save()
    }

    const connection = await getImapConnection(user)
    try {
        const emails = await connection.getUnseenMessages(fullUser.imapJoinDate)

        return emails.filter(message => filterThingMessage(user, message))
            .map(email=> imapEmailToDto(email, user))
    } finally {
        GoogleImapConnectionPool.releaseConnection(user, connection)
    }
}

async function getEmailsSince(user, internalDate) {
    const connection = await getImapConnection(user)
    try {
        const emails = await connection.getEmailsSince(internalDate)

        return emails.map(email => imapEmailToDto(email, user))
    } finally {
        GoogleImapConnectionPool.releaseConnection(user, connection)
    }
}

async function fetchFullThread(user, emailThreadId) {
    const connection = await getImapConnection(user)
    try {
        const emails = await connection.getThreadMessages(emailThreadId)

        return prepareThread(emails, user)
    } finally {
        GoogleImapConnectionPool.releaseConnection(user, connection)
    }
}

async function getLastInternalDate(user) {
    const connection = await getImapConnection(user)
    try {
        const email = await connection.getLastEmail()
        return email.header.internalDate
    } finally {
        GoogleImapConnectionPool.releaseConnection(user, connection)
    }
}

async function markAsRead(user, emailUids) {
    const connection = await getImapConnection(user)
    try {
        await connection.markAsRead(emailUids)
    } finally {
        GoogleImapConnectionPool.releaseConnection(user, connection)
    }
}

async function markAsReadByMessageId(user, messageId) {
    const connection = await getImapConnection(user)
    try {
        await connection.markAsReadByMessageId(messageId)
    } finally {
        GoogleImapConnectionPool.releaseConnection(user, connection)
    }
}

async function sendEmail(user, to, subject, text, html, messageId) {
    const connection = await getSmtpConnection(user)
    try {
        const email = await connection.send(to, subject, text, html, messageId)
        return smtpEmailToDto(email, user, subject, text, html)
    } finally {
        GoogleSmtpConnectionPool.releaseConnection(user, connection)
    }
}

function sendEmailForThing(user, to, subject, body, messageId) {
    const emailForThingHtml = getEmailForThingHtml(user, body)
    return sendEmail(user, to, subject, undefined, emailForThingHtml, messageId)
}

async function doEmail(user, emailThreadId) {
    const connection = await getImapConnection(user)
    try {
        const thread = await fetchFullThread(user, emailThreadId)

        const creator = thread.creator

        const comments = thread.messages.map(message => {
            return {
                createdAt: message.createdAt,
                html: message.payload.html,
                text: message.payload.text,
                id: message.id
            }
        })

        const thing = await saveNewThing(thread.subject, creator, userToAddress(user), thread.id, thread.payload.threadId)
        await EventsCreator.createCreated(creator, thing, getShowNewList)
        await EventsCreator.createAccepted(userToAddress(user), thing, getShowNewList)
        await comments.map(comment => EventsCreator.createComment(creator, comment.createdAt, thing, getShowNewList, comment.text,
                        comment.html, comment.id)).then(all => Promise.all(all))
    } finally {
        GoogleImapConnectionPool.releaseConnection(user, connection)
    }
}

async function replyToAll(user, to, inReplyTo, references, subject, messageText, messageHtml) {
    const connection = await getSmtpConnection(user)
    try {
        await connection.replyToAll(to, inReplyTo, references, subject, messageText, messageHtml)
    } finally {
        GoogleSmtpConnectionPool.releaseConnection(user, connection)
    }
}

function prepareThread(emails, user) {
    const firstEmail = chain(emails).sortBy('header.date').head().value()

    const threadDto = imapEmailToDto(firstEmail, user)
    threadDto.messages = emails.map(email => imapEmailToDto(email, user))

    if (firstEmail.payload && firstEmail.payload.threadId)
        threadDto.id = firstEmail.payload.threadId

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
    markAsReadByMessageId,
    markAsRead,
    sendEmail,
    sendEmailForThing,
    doEmail,
    replyToAll,
    getEmailsSince,
    getLastInternalDate
}
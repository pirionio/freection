import {chain, some, isUndefined, uniq} from 'lodash'
import converter from 'hex2dec'

import * as GoogleImapConnectionPool from '../utils/imap/google-imap-connection-pool'
import * as GoogleSmtpConnectionPool from '../utils/smtp/google-smtp-connection-pool'
import EntityTypes from '../../../common/enums/entity-types'
import ThingStatus from '../../../common/enums/thing-status'
import ThingSource from '../../../common/enums/thing-source'
import {User} from '../models'
import * as ThingDomain from '../domain/thing-domain'
import * as EventsCreator from './event-creator'
import {userToAddress} from './address-creator'
import {imapEmailToDto} from '../application/transformers'

function filterThingMessage(user, message) {
    const domain = user.email.substring(user.email.indexOf('@'))

    if (message.references && some(message.references, reference => reference.startsWith('thing/') && reference.endsWith(domain))) {
        return false
    }

    return true
}

export async function fetchUnreadMessages(user) {
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

    const connection = await getImapConnection(user, 'fetchUnreadMessages')
    try {
        const emails = await connection.getUnseenMessages(fullUser.imapJoinDate)

        return emails.filter(message => filterThingMessage(user, message))
            .map(email => imapEmailToDto(email, user))
    } finally {
        GoogleImapConnectionPool.releaseConnection(user, connection)
    }
}

export async function getEmailsSince(user, internalDate) {
    const connection = await getImapConnection(user, 'getEmailsSince')
    try {
        const emails = await connection.getEmailsSince(internalDate)

        return emails.map(email => imapEmailToDto(email, user))
    } finally {
        GoogleImapConnectionPool.releaseConnection(user, connection)
    }
}

export async function fetchFullThread(user, emailThreadId) {
    const connection = await getImapConnection(user, 'fetchFullThread')
    try {
        const emails = await connection.getThreadMessages(emailThreadId)

        return prepareThread(emails, user)
    } finally {
        GoogleImapConnectionPool.releaseConnection(user, connection)
    }
}

export async function getLastInternalDate(user) {
    const connection = await getImapConnection(user, 'getLastInternalDate')
    try {
        const email = await connection.getLastEmail()
        return email.header.internalDate
    } finally {
        GoogleImapConnectionPool.releaseConnection(user, connection)
    }
}

export async function markAsRead(user, emailUids) {
    const connection = await getImapConnection(user, 'markAsRead')
    try {
        await connection.markAsRead(emailUids)
    } finally {
        GoogleImapConnectionPool.releaseConnection(user, connection)
    }
}

export async function markAsReadByMessageId(user, messageId) {
    const connection = await getImapConnection(user, 'markAsReadByMessageId')
    try {
        await connection.markAsReadByMessageId(messageId)
    } finally {
        GoogleImapConnectionPool.releaseConnection(user, connection)
    }
}

export async function sendEmail(user, to, subject, text, html, messageId) {
    const connection = await getSmtpConnection(user)
    try {
        const email = await connection.send(to, subject, text, html, messageId)
        return smtpEmailToDto(email, user, subject, text, html)
    } finally {
        GoogleSmtpConnectionPool.releaseConnection(user, connection)
    }
}

export async function deleteAllEmails(user) {
    const connection = await getImapConnection(user, 'deleteAllEmails')
    try {
        await connection.deleteAllEmails()
    } finally {
        GoogleImapConnectionPool.releaseConnection(user, connection)
    }
}

export function sendEmailForThing(user, to, subject, body, messageId) {
    const emailForThingHtml = getEmailForThingHtml(user, body)
    return sendEmail(user, to, subject, undefined, emailForThingHtml, messageId)
}

export async function newEmailThing(user, emailData, isHex) {
    const emailThreadIdDec = isHex ? converter.hexToDec(emailData.threadId) : emailData.threadId
    const emailThreadIdHex = !isHex ? converter.decToHex(emailData.threadId) : emailData.threadId

    const thread = {
        subject: emailData.subject,
        id: emailThreadIdDec,
        payload: {
            threadId: emailThreadIdDec,
            threadIdHex: emailThreadIdHex,
            recipients: emailData.recipients
        }
    }

    const existingThing = await ThingDomain.getThingByThreadId(thread.id)
    if (existingThing && existingThing.payload && existingThing.payload.status !== ThingStatus.CLOSE.key)
        return

    const creator = userToAddress(user)
    const doer = userToAddress(user)

    const thing = saveNewThing(thread, creator, doer)
    thing.events.push(EventsCreator.createCreated(creator, thing, []))
    thing.events.push(EventsCreator.createAccepted(creator, thing, []))

    return await ThingDomain.updateThing(thing)
}

export async function doEmail(user, emailThreadId, isHex) {
    // Thread ID in Gmail is hex (in the Gmail API or in the website)m but dec in the IMAP API.
    // Since we're gonna work with IMAP here, we convert the ID to dec, and we should therefore know if it's received as hex or dec here.
    const emailThreadIdDec = isHex ? converter.hexToDec(emailThreadId) : emailThreadId
    const thread = await fetchFullThread(user, emailThreadIdDec)
    const creator = thread.creator

    const thing = await saveNewThing(thread, creator, doer)
    thing.events.push(EventsCreator.createCreated(creator, thing, []))
    thing.events.push(EventsCreator.createAccepted(creator, thing, []))

    return await ThingDomain.updateThing(thing)
}

export async function replyToAll(user, to, inReplyTo, references, subject, messageText, messageHtml) {
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

function saveNewThing(thread, creator, to) {
    return ThingDomain.createThing({
        createdAt: new Date(),
        creator,
        to,
        body: null,
        subject: thread.subject,
        followUpers: [],
        doers: [to.id],
        all: uniq([creator.id, to.id]),
        type: EntityTypes.EMAIL_THING.key,
        payload: {
            emailId: thread.id,
            threadId: thread.payload.threadId,
            threadIdHex: thread.payload.threadIdHex,
            status: ThingStatus.INPROGRESS.key,
            recipients: thread.payload.recipients,
            source: ThingSource.GMAIL.key
        },
        events: []
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
                    <a href="https://app.freection.com" target="_blank">here!</a>
                </span>
            </div>`
}

function getImapConnection(user, action) {
    return GoogleImapConnectionPool.getConnection(user, action)
}

function getSmtpConnection(user) {
    return GoogleSmtpConnectionPool.getConnection(user)
}
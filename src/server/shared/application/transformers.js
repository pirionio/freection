import parseReply from 'parse-reply'
import pick from 'lodash/pick'
import trimStart from 'lodash/trimStart'
import trimEnd from 'lodash/trimEnd'
import {chain} from 'lodash/core'

import {emailToAddress} from '../application/address-creator'
import EntityTypes from '../../../common/enums/entity-types'
import EventTypes from '../../../common/enums/event-types'
import SharedConstants from '../../../common/shared-constants'

export function thingToDto(thing, user, {includeEvents = true} = {}) {

    return {
        id: thing.id,
        createdAt: thing.createdAt,
        creator: thing.creator,
        to: thing.to,
        body: thing.body,
        subject: thing.subject,
        payload: thing.payload,
        type: EntityTypes[thing.type],
        events: includeEvents && thing.events ? thing.events.map(event => eventToDto(event, user, {includeThing: false})) : [],
        isFollowUper: thing.followUpers.includes(user.id),
        isDoer: thing.doers.includes(user.id),
        isSelf: thing.isSelf()
    }
}

export function eventToDto(event, user, {includeThing = true} = {}) {
    return {
        id: event.id,
        thing: includeThing && event.thing && thingToDto(event.thing, user, {includeEvents: false}),
        createdAt: event.createdAt,
        payload: SharedConstants.MESSAGE_TYPED_EVENTS.includes(event.eventType) ?
            commentPayloadToDto(event.payload, user) : event.payload,
        eventType: EventTypes[event.eventType],
        creator: event.creator,
        showNew: event.showNewList.includes(user.id)
    }
}

export function userToDto(user) {
    return pick(user, ['id', 'firstName', 'lastName', 'email'])
}

function commentPayloadToDto(payload, user) {
    if (!payload.readByList)
        return payload

    return Object.assign({}, payload, {
        isRead: payload.readByList.includes(user.id),
        readByList: undefined
    })
}

export function imapEmailToDto(email, user) {
    // TODO We don't know how differ the read status of a comment, and the discard of new email notifications.
    // Our app has these two different options, while a regular mail has only a single state (the \\Seen flag).
    // We decided for the meantime to set this flag in the discard flow, meaning that in the comments list - emails will
    // always appear as read.

    // The ID of IMAP returns with enclosing '<' and '>'. We get rid of it to keep it conformed to the email ID returned
    // by other email structures (such as SMTP).
    let id = trimStart(email.header.messageId, '<')
    id = trimEnd(id, '>')

    return {
        id: id,
        createdAt: email.header.date,
        creator: emailUserToDTO(email.header.from),
        to: email.header.to.map(to => emailUserToDTO(to)),
        subject: subjectToDto(email.header.subject),
        payload: {
            text: parseReply(email.body),
            html: email.html,
            threadId: email.header.gmailThreadId,
            threadIdHex: email.header.gmailThreadIdHex,
            gmailId: email.header.gmailId,
            uid: email.header.uid,
            isRead: true
        },
        type: EntityTypes.EMAIL,
        relatedThingId: getRelatedThingId(email, user),
        internalDate: email.header.internalDate
    }
}

function getRelatedThingId(email, user) {
    const domain = user.email.substring(user.email.indexOf('@'))

    const messageId = email.references && chain(email.references)
            .filter(reference => reference.startsWith('thing/') && reference.endsWith(domain))
            .head()
            .value()

    if (messageId) {
        const start = 'thing/'.length
        const end = messageId.indexOf('@')
        return messageId.substr(start, end - start)
    }
}

function emailUserToDTO(user) {
    const email = `${user.username }@${user.organization}`
    return emailToAddress(email, user.name)
}

function subjectToDto(subject) {
    if (!subject)
        return subject

    return subject.toLowerCase().startsWith('re: ') ?
        subject.substr('re: '.length) :
        subject
}
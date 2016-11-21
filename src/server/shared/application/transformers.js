import parseReply from 'parse-reply'
import trimStart from 'lodash/trimStart'
import trimEnd from 'lodash/trimEnd'
import {chain} from 'lodash/core'
import reject from 'lodash/reject'

import {emailToAddress} from '../application/address-creator'
import EntityTypes from '../../../common/enums/entity-types'
import EventTypes from '../../../common/enums/event-types'
import SharedConstants from '../../../common/shared-constants'
import * as ThingHelper from '../../../common/helpers/thing-helper'

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
        isCreator: thing.creator.id === user.id,
        isTo: thing.to.id === user.id,
        isFollowUper: thing.followUpers.includes(user.id),
        isDoer: thing.doers.includes(user.id),
        isMentioned: thing.mentioned ? thing.mentioned.includes(user.id) : false,
        isSubscriber: thing.subscribers ? thing.subscribers.includes(user.id) : false,
        isInAll: thing.all && thing.all.includes(user.id),
        isSelf: ThingHelper.isSelf(thing)
    }
}

export function eventToDto(event, user, {includeThing = true, includeFullThing = false} = {}) {
    return {
        id: event.id,
        thing: (includeThing || includeFullThing)&& event.thing && thingToDto(event.thing, user, {includeEvents: includeFullThing}),
        createdAt: event.createdAt,
        payload: SharedConstants.MESSAGE_TYPED_EVENTS.includes(event.eventType) ?
            commentPayloadToDto(event.creator, event.payload, user) : event.payload,
        eventType: EventTypes[event.eventType],
        creator: event.creator,
        showNew: event.showNewList.includes(user.id)
    }
}

function commentPayloadToDto(creator, payload, user) {
    if (!payload.readByList && !payload.mentioned)
        return payload

    return Object.assign({}, payload, {
        isRead: payload.readByList ? payload.readByList.includes(user.id) : false,
        isMentioned: payload.mentioned ? payload.mentioned.includes(user.id) : false,
        readByList: reject(payload.readByList, userId => creator.id === userId),
        mentioned: undefined
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
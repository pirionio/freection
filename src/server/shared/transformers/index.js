const parseReply = require('parse-reply')
const {pick} = require('lodash/core')

const EntityTypes = require('../../../common/enums/entity-types')
const EventTypes = require('../../../common/enums/event-types')
const UserTypes = require('../../../common/enums/user-types')

function thingToDto(thing, user, {includeEvents = true} = {}) {

    return {
        id: thing.id,
        createdAt: thing.createdAt,
        creator: thing.creator && userToDto(thing.creator),
        to: thing.to && userToDto(thing.to),
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

function eventToDto(event, user, {includeThing = true} = {}) {
    return {
        id: event.id,
        thing: includeThing && event.thing && thingToDto(event.thing, user, {includeEvents: false}),
        createdAt: event.createdAt,
        payload: event.eventType === EventTypes.COMMENT.key || event.eventType === EventTypes.PING.key ?
            commentPayloadToDto(event.payload, user) : event.payload,
        eventType: EventTypes[event.eventType],
        creator: event.creator,
        showNew: event.showNewList.includes(user.id)
    }
}

function userToDto(user) {
    return pick(user, ['id', 'firstName', 'lastName', 'email'])
}

function commentPayloadToDto(payload, user) {
    return Object.assign({}, payload, {
        isRead: payload.readByList.includes(user.id),
        readByList: undefined
    })
}

function emailToDto(email) {
    // TODO We don't know how differ the read status of a comment, and the discard of new email notifications.
    // Our app has these two different options, while a regular mail has only a single state (the \\Seen flag).
    // We decided for the meantime to set this flag in the discard flow, meaning that in the comments list - emails will
    // always appear as read.

    return {
        id: email.header.uid,
        createdAt: email.header.date,
        creator: emailUserToDTO(email.header.from),
        to: email.header.to.map(to => emailUserToDTO(to)),
        subject: email.header.subject,
        payload: {
            text: parseReply(email.body),
            html: email.html,
            threadId: email.header.gmailThreadId,
            gmailId: email.header.gmailId,
            messageId: email.header.messageId,
            isRead: true
        },
        type: EntityTypes.EMAIL
    }
}

function emailUserToDTO(user) {
    const email = `${user.username }@${user.organization}`

    return {
        id: email,
        type: UserTypes.EMAIL,
        email: email,
        payload: {
            email: email,
        },
        displayName: user.name
    }
}

module.exports = {thingToDto, eventToDto, userToDto, emailToDto}
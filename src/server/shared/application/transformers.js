const parseReply = require('parse-reply')
const pick = require('lodash/pick')
const trimStart = require('lodash/trimStart')
const trimEnd = require('lodash/trimEnd')
const {chain} = require('lodash/core')

const AddressCreator = require('../application/address-creator')
const EntityTypes = require('../../../common/enums/entity-types')
const EventTypes = require('../../../common/enums/event-types')
const UserTypes = require('../../../common/enums/user-types')

function thingToDto(thing, user, {includeEvents = true} = {}) {

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

function eventToDto(event, user, {includeThing = true} = {}) {
    return {
        id: event.id,
        thing: includeThing && event.thing && thingToDto(event.thing, user, {includeEvents: false}),
        createdAt: event.createdAt,
        payload: [EventTypes.COMMENT.key, EventTypes.CREATED.key, EventTypes.PING.key, EventTypes.PONG.key].includes(event.eventType) ?
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

function imapEmailToDto(email, user) {
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
    return AddressCreator.emailToAddress(email, user.name)
}

function subjectToDto(subject) {
    if (!subject)
        return subject

    return subject.toLowerCase().startsWith('re: ') ?
        subject.substr('re: '.length) :
        subject
}

module.exports = {thingToDto, eventToDto, userToDto, imapEmailToDto}
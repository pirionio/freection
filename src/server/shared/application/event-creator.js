import {Event} from '../models'
import EventTypes from '../../../common/enums/event-types'
import UserTypes from '../../../common/enums/user-types'
import * as analytics from '../utils/analytics.js'

export function createCreated(creator, thing, getShowNewList, body, emailId) {
    analytics.thingCreated(thing)

    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.CREATED.key,
        createdAt: thing.createdAt,
        creator,
        payload: {
            text: body,
            readByList: creator.type === UserTypes.FREECTION.key ? [creator.id] : [],
            emailId
        },
        showNewList: getShowNewList(creator, thing, EventTypes.CREATED.key)
    })
}

export function createAccepted(creator, thing, getShowNewList) {
    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.ACCEPTED.key,
        createdAt: new Date(),
        creator,
        payload: {},
        showNewList: getShowNewList(creator, thing, EventTypes.ACCEPTED.key)
    })
}

export function createDismissed(creator, thing, getShowNewList, messageText) {
    analytics.thingDismissed(creator, thing)

    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.DISMISSED.key,
        createdAt: new Date(),
        creator,
        payload: messageText ? {
            text: messageText,
            readByList: creator.type === UserTypes.FREECTION.key ? [creator.id] : []
        } : {},
        showNewList: getShowNewList(creator, thing, EventTypes.DISMISSED.key)
    })
}

export function createDone(creator, thing, getShowNewList, messageText) {
    analytics.thingMarkedAsDone(creator, thing)

    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.DONE.key,
        createdAt: new Date(),
        creator,
        payload: messageText ? {
            text: messageText,
            readByList: creator.type === UserTypes.FREECTION.key ? [creator.id] : []
        } : {},
        showNewList: getShowNewList(creator, thing, EventTypes.DONE.key)
    })
}

export function createComment(creator, createdAt, thing, getShowNewList, commentText, commentHtml, emailId) {
    const showNewList = getShowNewList(creator, thing, EventTypes.COMMENT.key)

    analytics.commentCreated(creator, thing, showNewList)

    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.COMMENT.key,
        createdAt,
        creator,
        payload: {
            emailId,
            html: commentHtml,
            text: commentText,
            readByList: creator.type === UserTypes.FREECTION.key ? [creator.id] : []
        },
        showNewList
    })
}

export function createClosed(creator, thing, getShowNewList, messageText) {
    analytics.closed(creator, thing)

    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.CLOSED.key,
        createdAt: new Date(),
        creator,
        payload: messageText ? {
            text: messageText,
            readByList: creator.type === UserTypes.FREECTION.key ? [creator.id] : []
        } : {},
        showNewList: getShowNewList(creator, thing, EventTypes.CLOSED.key)
    })
}

export function createPing(creator, thing, getShowNewList) {
    analytics.pingCreated(creator, thing)

    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.PING.key,
        createdAt: new Date(),
        creator,
        payload: {
            readByList: creator.type === UserTypes.FREECTION.key ? [creator.id] : []
        },
        showNewList: getShowNewList(creator, thing, EventTypes.PING.key)
    })
}

export function createPong(creator, thing, getShowNewList, messageText) {
    analytics.pongCreated(creator, thing)

    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.PONG.key,
        createdAt: new Date(),
        creator,
        payload: {
            text: messageText,
            readByList: creator.type === UserTypes.FREECTION.key ? [creator.id] : []
        },
        showNewList: getShowNewList(creator, thing, EventTypes.PONG.key)
    })
}

export function createSentBack(creator, thing, getShowNewList, messageText) {
    analytics.sentBack(creator, thing)

    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.SENT_BACK.key,
        createdAt: new Date(),
        creator,
        payload: messageText ? {
            text: messageText,
            readByList: creator.type === UserTypes.FREECTION.key ? [creator.id] : []
        } : {},
        showNewList: getShowNewList(creator, thing, EventTypes.SENT_BACK.key)
    })
}

export function createCloseAck(creator, thing, getShowNewList) {
    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.CLOSE_ACKED.key,
        createdAt: new Date(),
        creator,
        payload: {},
        showNewList: getShowNewList(creator, thing, EventTypes.CLOSE_ACKED.key)
    })
}

export function createMentioned(creator, thing, getShowNewList, mentionedUser, messageText) {
    const showNewList = getShowNewList(creator, thing, EventTypes.MENTIONED.key)

    analytics.mentioned(creator, thing, mentionedUser.id)

    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.MENTIONED.key,
        createdAt: new Date(),
        creator,
        payload: {
            mentionedUserId: mentionedUser.id,
            text: messageText,
            readByList: creator.type === UserTypes.FREECTION.key ? [creator.id] : []
        },
        showNewList
    })
}

export function createJoinedMention(creator, thing, getShowNewList) {
    analytics.joined(creator, thing)

    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.JOINED_MENTION.key,
        createdAt: new Date(),
        creator,
        payload: {},
        showNewList: getShowNewList(creator, thing, EventTypes.JOINED_MENTION.key)
    })
}

export function createLeftMention(creator, thing, getShowNewList) {
    analytics.left(creator, thing)

    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.LEFT_MENTION.key,
        createdAt: new Date(),
        creator,
        payload: {},
        showNewList: getShowNewList(creator, thing, EventTypes.LEFT_MENTION.key)
    })
}

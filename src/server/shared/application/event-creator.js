import {Event} from '../models'
import EventTypes from '../../../common/enums/event-types'
import UserTypes from '../../../common/enums/user-types'
import * as analytics from '../utils/analytics.js'

export function createCreated(creator, thing, showNewList, mentionedUserIds, body, emailId) {
    analytics.thingCreated(thing)

    return {
        thingId: thing.id,
        eventType: EventTypes.CREATED.key,
        createdAt: thing.createdAt,
        creator,
        payload: {
            text: body,
            readByList: creator.type === UserTypes.FREECTION.key ? [creator.id] : [],
            mentioned: mentionedUserIds,
            emailId
        },
        showNewList
    }
}

export function createAccepted(creator, thing, showNewList) {
    return {
        thingId: thing.id,
        eventType: EventTypes.ACCEPTED.key,
        createdAt: new Date(),
        creator,
        payload: {},
        showNewList
    }
}

export function createDismissed(creator, thing, showNewList, messageText) {
    analytics.thingDismissed(creator, thing)

    return {
        thingId: thing.id,
        eventType: EventTypes.DISMISSED.key,
        createdAt: new Date(),
        creator,
        payload: messageText ? {
            text: messageText,
            readByList: creator.type === UserTypes.FREECTION.key ? [creator.id] : []
        } : {},
        showNewList
    }
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

export function createComment(creator, createdAt, thing, getShowNewList, mentionedUserIds, commentText, commentHtml, emailId) {
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
            readByList: creator.type === UserTypes.FREECTION.key ? [creator.id] : [],
            mentioned: mentionedUserIds
        },
        showNewList
    })
}

export function createClosedSync(creator, thing, showNewList, messageText) {
    analytics.closed(creator, thing)
    
    return {
        thingId: thing.id,
        eventType: EventTypes.CLOSED.key,
        createdAt: new Date(),
        creator,
        payload: messageText ? {
            text: messageText,
            readByList: creator.type === UserTypes.FREECTION.key ? [creator.id] : []
        } : {},
        showNewList
    }
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

export function createUnmute(creator, thing, getShowNewList) {
    analytics.joined(creator, thing)

    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.UNMUTED.key,
        createdAt: new Date(),
        creator,
        payload: {},
        showNewList: getShowNewList(creator, thing, EventTypes.UNMUTED.key)
    })
}

export function createMute(creator, thing, getShowNewList) {
    analytics.muted(creator, thing)

    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.MUTED.key,
        createdAt: new Date(),
        creator,
        payload: {},
        showNewList: getShowNewList(creator, thing, EventTypes.MUTED.key)
    })
}

export function createFollowedUp(creator, thing, getShowNewList) {
    analytics.followedUp(creator, thing)

    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.FOLLOWED_UP.key,
        createdAt: new Date(),
        creator,
        payload: {},
        showNewList: getShowNewList(creator, thing, EventTypes.FOLLOWED_UP.key)
    })
}

export function createUnfollowedUp(creator, thing, getShowNewList) {
    analytics.unfollowed(creator, thing)

    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.UNFOLLOWED.key,
        createdAt: new Date(),
        creator,
        payload: {},
        showNewList: getShowNewList(creator, thing, EventTypes.UNFOLLOWED.key)
    })
}
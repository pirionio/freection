import {Event} from '../models'
import EventTypes from '../../../common/enums/event-types'
import UserTypes from '../../../common/enums/user-types'
import * as analytics from '../utils/analytics.js'
import ThingStatus from '../../../common/enums/thing-status.js'

export function createCreated(creator, thing, showNewList, mentionedUserIds, commentText, commentHtml, emailId) {
    analytics.thingCreated(thing, showNewList)
    analytics.mentioned(creator, thing, mentionedUserIds)

    return {
        thingId: thing.id,
        eventType: EventTypes.CREATED.key,
        createdAt: thing.createdAt,
        creator,
        payload: {
            text: commentText,
            html: commentHtml,
            readByList: creator.type === UserTypes.FREECTION.key ? [creator.id] : [],
            readByEmailList: [],
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
    analytics.thingDismissed(creator, thing, showNewList)

    return {
        thingId: thing.id,
        eventType: EventTypes.DISMISSED.key,
        createdAt: new Date(),
        creator,
        payload: messageText ? {
            text: messageText,
            readByList: creator.type === UserTypes.FREECTION.key ? [creator.id] : [],
            readByEmailList: []
        } : {},
        showNewList
    }
}

export function createDone(creator, thing, showNewList, messageText, messageHtml) {
    analytics.thingMarkedAsDone(creator, thing, showNewList)

    return {
        thingId: thing.id,
        eventType: EventTypes.DONE.key,
        createdAt: new Date(),
        creator,
        payload: messageText ? {
            text: messageText,
            html: messageHtml,
            readByList: creator.type === UserTypes.FREECTION.key ? [creator.id] : [],
            readByEmailList: []
        } : {},
        showNewList
    }
}

export function createComment(creator, createdAt, thing, showNewList, mentionedUserIds, commentText, commentHtml, emailId) {
    analytics.commentCreated(creator, thing, showNewList)
    analytics.mentioned(creator, thing, mentionedUserIds)

    return {
        thingId: thing.id,
        eventType: EventTypes.COMMENT.key,
        createdAt,
        creator,
        payload: {
            emailId,
            html: commentHtml,
            text: commentText,
            readByList: creator.type === UserTypes.FREECTION.key ? [creator.id] : [],
            readByEmailList: [],
            mentioned: mentionedUserIds
        },
        showNewList
    }
}

export function createClosedSync(creator, thing, showNewList, messageText) {
    analytics.closed(creator, thing, showNewList)
    
    return {
        thingId: thing.id,
        eventType: EventTypes.CLOSED.key,
        createdAt: new Date(),
        creator,
        payload: messageText ? {
            text: messageText,
            readByList: creator.type === UserTypes.FREECTION.key ? [creator.id] : [],
            readByEmailList: []
        } : {},
        showNewList
    }
}

export function createClosed(creator, thing, showNewList, messageText) {

    if ([ThingStatus.NEW.key, ThingStatus.INPROGRESS.key, ThingStatus.REOPENED].includes(thing.payload.status))
        analytics.closed(creator, thing, showNewList)

    return {
        thingId: thing.id,
        eventType: EventTypes.CLOSED.key,
        createdAt: new Date(),
        creator,
        payload: messageText ? {
            text: messageText,
            readByList: creator.type === UserTypes.FREECTION.key ? [creator.id] : [],
            readByEmailList: []
        } : {},
        showNewList
    }
}

export function createPing(creator, thing, showNewList) {
    analytics.pingCreated(creator, thing, showNewList)

    return {
        thingId: thing.id,
        eventType: EventTypes.PING.key,
        createdAt: new Date(),
        creator,
        payload: {
            readByList: creator.type === UserTypes.FREECTION.key ? [creator.id] : [],
            readByEmailList: []
        },
        showNewList
    }
}

export function createPong(creator, thing, showNewList, messageText) {
    analytics.pongCreated(creator, thing, showNewList)

    return {
        thingId: thing.id,
        eventType: EventTypes.PONG.key,
        createdAt: new Date(),
        creator,
        payload: {
            text: messageText,
            readByList: creator.type === UserTypes.FREECTION.key ? [creator.id] : [],
            readByEmailList: []
        },
        showNewList
    }
}

export function createSentBack(creator, thing, showNewList, messageText) {
    analytics.sentBack(creator, thing, showNewList)

    return {
        thingId: thing.id,
        eventType: EventTypes.SENT_BACK.key,
        createdAt: new Date(),
        creator,
        payload: messageText ? {
            text: messageText,
            readByList: creator.type === UserTypes.FREECTION.key ? [creator.id] : [],
            readByEmailList: []
        } : {},
        showNewList
    }
}

export function createCloseAck(creator, thing, showNewList) {
    return {
        thingId: thing.id,
        eventType: EventTypes.CLOSE_ACKED.key,
        createdAt: new Date(),
        creator,
        payload: {},
        showNewList: showNewList
    }
}

export function createUnmute(creator, thing, getShowNewList) {
    analytics.unmuted(creator, thing)

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
    if ([ThingStatus.NEW.key, ThingStatus.INPROGRESS.key, ThingStatus.REOPENED].includes(thing.payload.status))
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

export function createUnassigned(creator, thing, showNewList, user) {
    analytics.unassigned(user, thing, creator)

    return {
        thingId: thing.id,
        eventType: EventTypes.UNASSIGNED.key,
        createdAt: new Date(),
        creator,
        payload: {},
        showNewList
    }
}

export function createTrelloListChanged(creator, thing, showNewList, user, fromList, toList) {
    return {
        thingId: thing.id,
        eventType: EventTypes.TRELLO_LIST_CHANGED.key,
        createdAt: new Date(),
        creator,
        payload: {
            fromList,
            toList
        },
        showNewList
    }
}

export function createSuggestion(creator, thing, showNewList, messageText) {
    return {
        thingId: thing.id,
        eventType: EventTypes.SUGGESTION.key,
        createdAt: new Date(),
        creator,
        payload: {
            text: messageText
        },
        showNewList
    }
} 
import {Event} from '../models'
import EventTypes from '../../../common/enums/event-types'
import UserTypes from '../../../common/enums/user-types'

export function createCreated(creator, thing, getShowNewList, body, emailId) {
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
        showNewList: getShowNewList(creator, thing, EventTypes.COMMENT.key)
    })
}

export function createClosed(creator, thing, getShowNewList, messageText) {
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

export function createMentioned(creator, thing, getShowNewList, messageText) {
    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.MENTIONED.key,
        createdAt: new Date(),
        creator,
        payload: {
            text: messageText,
            readByList: creator.type === UserTypes.FREECTION.key ? [creator.id] : []
        },
        showNewList: getShowNewList(creator, thing, EventTypes.MENTIONED.key)
    })
}
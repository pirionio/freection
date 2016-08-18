const {Event} = require('../models')
const EventTypes = require('../../../common/enums/event-types')
const UserTypes = require('../../../common/enums/user-types')

function createCreated(creator, thing, getShowNewList, body, emailId) {
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

function createAccepted(creator, thing, getShowNewList) {
    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.ACCEPTED.key,
        createdAt: new Date(),
        creator,
        payload: {},
        showNewList: getShowNewList(creator, thing, EventTypes.ACCEPTED.key)
    })
}

function createDismissed(creator, thing, getShowNewList, messageText) {
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

function createDone(creator, thing, getShowNewList, messageText) {
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

function createComment(creator, createdAt, thing, getShowNewList, commentText, commentHtml, emailId) {
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

function createClosed(creator, thing, getShowNewList, messageText) {
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

function createPing(creator, thing, getShowNewList) {
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

function createPong(creator, thing, getShowNewList, messageText) {
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

function createSentBack(creator, thing, getShowNewList, messageText) {
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

function createCloseAck(creator, thing, getShowNewList) {
    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.CLOSE_ACKED.key,
        createdAt: new Date(),
        creator,
        payload: {},
        showNewList: getShowNewList(creator, thing, EventTypes.CLOSE_ACKED.key)
    })
}

module.exports = {
    createCreated,
    createAccepted,
    createDismissed,
    createDone,
    createCloseAck,
    createComment,
    createClosed,
    createPing,
    createPong,
    createSentBack
}
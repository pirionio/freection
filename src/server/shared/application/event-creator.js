const {Event} = require('../models')
const EventTypes = require('../../../common/enums/event-types')

function createCreated(user, thing, getShowNewList) {
    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.CREATED.key,
        createdAt: thing.createdAt,
        creatorUserId: user.id,
        payload: {},
        showNewList: getShowNewList(user, thing, EventTypes.CREATED.key)
    })
}

function createAccepted(user, thing, getShowNewList) {
    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.ACCEPTED.key,
        createdAt: new Date(),
        creatorUserId: user.id,
        payload: {},
        showNewList: getShowNewList(user, thing, EventTypes.ACCEPTED.key)
    })
}

function createDismissed(user, thing, getShowNewList) {
    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.DISMISSED.key,
        createdAt: new Date(),
        creatorUserId: user.id,
        payload: {},
        showNewList: getShowNewList(user, thing, EventTypes.DISMISSED.key)
    })
}

function createDone(user, thing, getShowNewList) {
    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.DONE.key,
        createdAt: new Date(),
        creatorUserId: user.id,
        payload: {},
        showNewList: getShowNewList(user, thing, EventTypes.DONE.key)
    })
}

function createCanceled(user, thing, getShowNewList) {
    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.CANCELED.key,
        createdAt: new Date(),
        creatorUserId: user.id,
        payload: {},
        showNewList: getShowNewList(user, thing, EventTypes.CANCELED.key)
    })
}

function createComment(user, thing, getShowNewList, commentText) {
    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.COMMENT.key,
        createdAt: new Date(),
        creatorUserId: user.id,
        payload: {
            text: commentText,
            readByList: [user.id]
        },
        showNewList: getShowNewList(user, thing, EventTypes.COMMENT.key)
    })
}

function createClosed(user, thing, getShowNewList) {
    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.CLOSED.key,
        createdAt: new Date(),
        creatorUserId: user.id,
        payload: {},
        showNewList: getShowNewList(user, thing, EventTypes.CLOSED.key)
    })
}

function createPing(user, thing, getShowNewList) {
    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.PING.key,
        createdAt: new Date(),
        creatorUserId: user.id,
        payload: {
            readByList: [user.id]
        },
        showNewList: getShowNewList(user, thing, EventTypes.PING.key)
    })
}

function createSentBack(user, thing, getShowNewList) {
    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.SENT_BACK.key,
        createdAt: new Date(),
        creatorUserId: user.id,
        payload: {},
        showNewList: getShowNewList(user, thing, EventTypes.SENT_BACK.key)
    })
}

function createCancelAck(user, thing, getShowNewList) {
    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.CANCEL_ACKED.key,
        createdAt: new Date(),
        creatorUserId: user.id,
        payload: {},
        showNewList: getShowNewList(user, thing, EventTypes.CANCEL_ACKED.key)
    })
}

module.exports = {
    createCreated,
    createAccepted,
    createDismissed,
    createDone,
    createCanceled,
    createCancelAck,
    createComment,
    createClosed,
    createPing,
    createSentBack
}
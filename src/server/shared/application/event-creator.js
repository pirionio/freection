const union = require('lodash/union')

const {Event} = require('../models')
const EventTypes = require('../../../common/enums/event-types')

function createCreated(user, thing) {
    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.CREATED.key,
        createdAt: thing.createdAt,
        creatorUserId: user.id,
        payload: {},
        showNewList: filterShowNewList(thing, [thing.toUserId])
    })
}

function createAccepted(user, thing) {
    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.ACCEPTED.key,
        createdAt: new Date(),
        creatorUserId: user.id,
        payload: {},
        showNewList: []
    })
}

function createDismissed(user, thing) {
    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.DISMISSED.key,
        createdAt: new Date(),
        creatorUserId: user.id,
        payload: {},
        showNewList: filterShowNewList(thing, [thing.creatorUserId])
    })
}

function createDone(user, thing) {
    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.DONE.key,
        createdAt: new Date(),
        creatorUserId: user.id,
        payload: {},
        showNewList: filterShowNewList(thing, [thing.creatorUserId])
    })
}

function createCanceled(user, thing) {
    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.CANCELED.key,
        createdAt: new Date(),
        creatorUserId: user.id,
        payload: {},
        showNewList: filterShowNewList(thing, union([thing.toUserId], thing.doers))
    })
}

function createComment(user, thing, commentText) {
    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.COMMENT.key,
        createdAt: new Date(),
        creatorUserId: user.id,
        payload: {
            text: commentText,
            readByList: [user.id]
        },
        showNewList: filterShowNewList(thing,
            [...thing.followUpers, ...thing.doers].filter(userId => userId !== user.id))
    })
}

function createClosed(user, thing) {
    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.CLOSED.key,
        createdAt: new Date(),
        creatorUserId: user.id,
        payload: {},
        showNewList: []
    })
}

function createPing(user, thing) {
    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.PING.key,
        createdAt: new Date(),
        creatorUserId: user.id,
        payload: {
            readByList: [user.id]
        },
        showNewList: filterShowNewList(thing, [...thing.doers])
    })
}

function createSentBack(user, thing) {
    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.SENT_BACK.key,
        createdAt: new Date(),
        creatorUserId: user.id,
        payload: {},
        showNewList: filterShowNewList(thing, [...thing.doers, thing.toUserId])
    })
}

function filterShowNewList(thing, list) {
    return thing.isSelf() ? [] : list
}

module.exports = {
    createCreated,
    createAccepted,
    createDismissed,
    createDone,
    createCanceled,
    createComment,
    createClosed,
    createPing,
    createSentBack
}
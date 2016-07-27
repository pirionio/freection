const union = require('lodash/union')

const {Event} = require('../models')
const EventTypes = require('../../../common/enums/event-types')

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
        showNewList: [thing.creatorUserId]
    })
}

function createDone(user, thing) {
    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.DONE.key,
        createdAt: new Date(),
        creatorUserId: user.id,
        payload: {},
        showNewList: [thing.creatorUserId]
    })
}

function createAborted(user, thing) {
    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.ABORTED.key,
        createdAt: new Date(),
        creatorUserId: user.id,
        payload: {},
        showNewList: union([thing.toUserId], thing.doers)
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
        showNewList: [...thing.followUpers, ...thing.doers].filter(userId => userId !== user.id)
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
        showNewList: [...thing.doers]
    })
}

module.exports = {
    createAccepted,
    createDismissed,
    createDone,
    createAborted,
    createComment,
    createClosed,
    createPing
}
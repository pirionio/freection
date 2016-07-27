const {remove, union} = require('lodash')

const {Event} = require('../models')
const EventTypes = require('../../../common/enums/event-types')
const logger = require('../utils/logger')

function userAcceptedThing(user, thing) {
    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.ACCEPTED.key,
        createdAt: new Date(),
        creatorUserId: user.id,
        payload: {},
        showNewList: []
    })
}

function userDismissThing(user, thing) {
    return Event.discardAllUserEvents(thing.id, user.id).then(() => {
        return Event.save({
            thingId: thing.id,
            eventType: EventTypes.DISMISSED.key,
            createdAt: new Date(),
            creatorUserId: user.id,
            payload: {},
            showNewList: [thing.creator.id]
        })
    })
}

function userMarkedThingAsDone(user, thing) {
    return Event.discardAllUserEvents(thing.id, user.id).then(() => {
        return Event.save({
            thingId: thing.id,
            eventType: EventTypes.DONE.key,
            createdAt: new Date(),
            creatorUserId: user.id,
            payload: {},
            showNewList: [thing.creator.id]
        })
    })
}

function userAbortedThing(user, thing) {
    return Event.discardAllUserEvents(thing.id, user.id).then(() => {
        return Event.save({
            thingId: thing.id,
            eventType: EventTypes.ABORTED.key,
            createdAt: new Date(),
            creatorUserId: user.id,
            payload: {},
            showNewList: union([thing.toUserId], thing.doers)
        })
    })
}

function userCreatedComment(user, thing, commentText) {
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

function userClosedThing(user, thing) {
    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.CLOSED.key,
        createdAt: new Date(),
        creatorUserId: user.id,
        payload: {},
        showNewList: []
    })
}

function userPingedThing(user, thing) {
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

function userAck(event, user) {
    remove(event.showNewList, readerUserId => readerUserId === user.id)
    return event.save()
}

function discardUserEventById(user, eventId) {
    return Event.discardUserEventById(eventId, user.id)
        .catch(error => {
            logger.error(`Could not discard event ${eventId} unread by user ${user.email}`, error)
            throw error
        })
}

function discardUserEventsByType(user, thingId, eventType) {
    return Event.discardUserEventsByType(thingId, eventType, user.id)
        .catch(error => {
            logger.error(`Could not discard events of type ${eventType} unread by user ${user.email} for thing ${thingId}`, error)
            throw error
        })
}

module.exports = {
    userAcceptedThing,
    userDismissThing,
    userMarkedThingAsDone,
    userClosedThing,
    userAbortedThing,
    userAck,
    userCreatedComment,
    userPingedThing,
    discardUserEventsByType,
    discardUserEventById
}

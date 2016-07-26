const {remove} = require('lodash')

const {Event} = require('../models')
const EventTypes = require('../../../common/enums/event-types')

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

function userAck(event, user) {
    remove(event.showNewList, readerUserId => readerUserId === user.id)
    return event.save()
}

module.exports = {
    userAcceptedThing,
    userDismissThing,
    userMarkedThingAsDone,
    userClosedThing,
    userAck,
    userCreatedComment
}

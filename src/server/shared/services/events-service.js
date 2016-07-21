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

function userCompletedThing(user, thing) {
    return Event.markAllThingEventsAsRead(thing.id).then(() => {
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

function userAck(event, user) {
    remove(event.showNewList, readerUserId => readerUserId === user.id)
    return event.save()
}

module.exports = {
    userAcceptedThing,
    userCompletedThing,
    userAck,
    userCreatedComment
}

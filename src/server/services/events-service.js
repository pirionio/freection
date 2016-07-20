const {remove} = require('lodash')

const {Event} = require('../models')
const EventTypes = require('../../common/enums/event-types')

function userAcceptedThing(user, thing) {
    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.ACCEPTED.key,
        createdAt: new Date(),
        creatorUserId: user.id,
        payload: {},
        readList: []
    })
}

function userCompletedThing(user, thing) {
    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.DONE.key,
        createdAt: new Date(),
        creatorUserId: user.id,
        payload: {},
        readList: [thing.creator.id]
    })
}

function userCreatedComment(user, thing, commentText) {
    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.COMMENT.key,
        createdAt: new Date(),
        creatorUserId: user.id,
        payload: {
            text: commentText
        },
        readList: [...thing.followUpers, ...thing.doers]
    })
}

function userHasRead(event, user) {
    remove(event.readList, readerUserId => readerUserId === user.id)
    return event.save()
}

module.exports = {
    userAcceptedThing,
    userCompletedThing,
    userHasRead,
    userCreatedComment
}

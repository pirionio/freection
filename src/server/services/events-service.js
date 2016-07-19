const {remove} = require('lodash')

const {Event} = require('../models')
const EventTypes = require('../../common/enums/event-types')

function thingAccepted(thing) {
    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.ACCEPTED.key,
        createdAt: new Date(),
        payload: {},
        readList: []
    })
}

function thingDone(thing) {
    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.DONE.key,
        createdAt: new Date(),
        payload: {},
        readList: [thing.creator.id]
    })
}

function userHasRead(event, user) {
    remove(event.readList, readerUserId => readerUserId === user.id)
    return event.save()
}

module.exports = {
    thingAccepted,
    thingDone,
    userHasRead
}

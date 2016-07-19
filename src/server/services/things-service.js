const {Event, Thing} = require('../models')
const EventsService = require('./events-service')
const EventTransformer = require('../transformers/event-transformer')
const ThingTransformer = require('../transformers/thing-transformer')
const TaskStatus = require('../../common/enums/task-status')
const logger = require('../utils/logger')

function getWhatsNew(user) {
    return Event.getWhatsNew(user.id)
        .then(events => events.map(EventTransformer.docToDto))
        .catch(error => {
            logger.error(`error while fetching whats new for user ${user.email}`, error)
            throw error
        })
}

function getToDo(user) {
    return Thing.getUserToDos(user.id)
        .then(things => things.map(ThingTransformer.docToDto))
        .catch(error => {
            logger.error(`error while fetching to do list for user ${user.email}`, error)
            throw error
        })
}

function getFollowUps(user) {
    return Thing.getUserFollowUps(user.id)
        .then(followUps => followUps.map(ThingTransformer.docToDto))
        .catch(error => {
            logger.error(`error while fetching follow ups for user ${user.email}`, error)
            throw error
        })
}

function doThing(user, thingId, eventId) {
    return Thing.get(thingId).run()
        .then(thing => performDoThing(thing, user))
        .then(EventsService.thingAccepted)
        .then(() => Event.get(eventId).run())
        .then(event => EventsService.userHasRead(event, user))
        .catch((error) => {
            logger.error(`error while setting user ${user.email} as doer of thing ${thingId}: ${error}`)
            throw error
        }
    )
}

function completeThing(user, thingId) {
    return Thing.getFullThing(thingId)
        .then(thing => completeThing(thing, user))
        .then(EventsService.thingDone)
        .catch((error) => {
            logger.error(`Error while completing thing ${thingId} by user ${user.email}:`, error)
            throw error
        })
}

function performDoThing(thing, user) {
    thing.doers.push(user.id)
    thing.payload.status = TaskStatus.INPROGRESS.key
    return thing.save()
}

module.exports = {
    getWhatsNew,
    getToDo,
    getFollowUps,
    doThing,
    completeThing
}
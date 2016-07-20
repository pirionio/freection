const {omit, remove} = require('lodash')

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
        .then(things => things.map(thing => Object.assign(thing, {
            comments: thing.comments.map(comment => EventTransformer.docToDto(comment, true))
        })))
        .catch(error => {
            logger.error(`error while fetching to do list for user ${user.email}`, error)
            throw error
        })
}

function getFollowUps(user) {
    return Thing.getUserFollowUps(user.id)
        .then(followUps => followUps.map(ThingTransformer.docToDto))
        .then(things => things.map(thing => Object.assign(thing, {
            comments: thing.comments.map(comment => EventTransformer.docToDto(comment, true))
        })))
        .catch(error => {
            logger.error(`error while fetching follow ups for user ${user.email}`, error)
            throw error
        })
}

function doThing(user, thingId, eventId) {
    return Thing.get(thingId).run()
        .then(thing => performDoThing(thing, user))
        .then(thing => EventsService.userAcceptedThing(user, thing))
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
        .then(thing => performCompleteThing(thing, user))
        .then(thing => EventsService.userCompletedThing(user, thing))
        .catch((error) => {
            logger.error(`Error while completing thing ${thingId} by user ${user.email}:`, error)
            throw error
        })
}

function createComment(user, thingId, commentText) {
    return Thing.get(thingId).run()
        .then(thing => EventsService.userCreatedComment(user, thing, commentText))
        .then(event => Event.getFullEvent(event.id))
        .then(event => EventTransformer.docToDto(omit(event, 'thing')))
        .catch(error => {
            logger.error(`Could not comment on thing ${thingId} for user ${user.email}`, error)
            throw error
        })
}

function performDoThing(thing, user) {
    thing.doers.push(user.id)
    thing.payload.status = TaskStatus.INPROGRESS.key
    return thing.save()
}

function performCompleteThing(thing, user) {
    remove(thing.doers, doerId => doerId === user.id)
    thing.payload.status = TaskStatus.DONE.key
    return thing.save()
}

module.exports = {
    getWhatsNew,
    getToDo,
    getFollowUps,
    doThing,
    completeThing,
    createComment
}
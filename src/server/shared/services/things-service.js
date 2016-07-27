const {remove} = require('lodash')

const {Event, Thing} = require('../models')
const EventsService = require('./events-service')
const {eventToDto, thingToDto} = require('../transformers')
const TaskStatus = require('../../../common/enums/task-status')
const EventTypes = require('../../../common/enums/event-types')
const logger = require('../utils/logger')


function getWhatsNew(user) {
    return Event.getWhatsNew(user.id)
        .then(events => events.map(event => eventToDto(event, user)))
        .catch(error => {
            logger.error(`error while fetching whats new for user ${user.email}`, error)
            throw error
        })
}

function getToDo(user) {
    return Thing.getUserToDos(user.id)
        .then(things => things.map(thing => thingToDto(thing, user)))
        .catch(error => {
            logger.error(`error while fetching to do list for user ${user.email}`, error)
            throw error
        })
}

function getFollowUps(user) {
    return Thing.getUserFollowUps(user.id)
        .then(followUps => followUps.map(thing => thingToDto(thing, user)))
        .catch(error => {
            logger.error(`error while fetching follow ups for user ${user.email}`, error)
            throw error
        })
}

function doThing(user, thingId) {
    return Thing.get(thingId).run()
        .then(thing => performDoThing(thing, user))
        .then(thing => EventsService.userAcceptedThing(user, thing))
        .then(() => Event.discardUserEventsByType(thingId, EventTypes.CREATED.key, user.id))
        .catch((error) => {
            logger.error(`error while setting user ${user.email} as doer of thing ${thingId}: ${error}`)
            throw error
        }
    )
}

function dismissThing(user, thingId) {
    return Thing.getFullThing(thingId)
        .then(thing => performDismissThing(thing, user))
        .then(thing => EventsService.userDismissThing(user, thing))
        .catch((error) => {
                logger.error(`error while dismissing thing ${thingId} by user ${user.email}: ${error}`)
                throw error
            }
        )
}

function closeThing(user, thingId) {
    // TODO: check if the if the status is done

    return Thing.get(thingId).run()
        .then(thing => performCloseThing(thing, user))
        .then(thing => EventsService.userClosedThing(user, thing))
        .then(() => Event.discardAllUserEvents(thingId, user.id))
        .catch((error) => {
                logger.error(`error while closing thing ${thingId} by user ${user.email}: ${error}`)
                throw error
            }
        )
}

function abortThing(user, thingId) {
    // TODO: check if the if the status is done

    return Thing.get(thingId).run()
        .then(thing => performAbortThing(thing, user))
        .then(thing => EventsService.userAbortedThing(user, thing))
        .catch((error) => {
                logger.error(`error while aborting thing ${thingId} by user ${user.email}: ${error}`)
                throw error
            }
        )
}

function markThingAsDone(user, thingId) {
    return Thing.getFullThing(thingId)
        .then(thing => performMarkThingAsDone(thing, user))
        .then(thing => EventsService.userMarkedThingAsDone(user, thing))
        .catch((error) => {
            logger.error(`Error while marking thing ${thingId} as done by user ${user.email}:`, error)
            throw error
        })
}

function pingThing(user, thingId) {
    return Thing.get(thingId).run()
        .then(thing => EventsService.userPingedThing(user, thing))
        .then(event => Event.getFullEvent(event.id))
        .then(event => eventToDto(event, user, {includeThing: false}))
        .catch(error => {
            logger.error(`Error while pinging thing ${thingId} by user ${user.email}`, error)
            throw error
        })
}

function createComment(user, thingId, commentText) {
    return Thing.get(thingId).run()
        .then(thing => EventsService.userCreatedComment(user, thing, commentText))
        .then(event => Event.getFullEvent(event.id))
        .then(event => eventToDto(event, user, {includeThing: false}))
        .catch(error => {
            logger.error(`Could not comment on thing ${thingId} for user ${user.email}`, error)
            throw error
        })
}

function markCommentAsRead(user, commentId) {
    return Event.markUserCommentAsRead(commentId, user.id)
        .catch(error => {
            logger.error(`Could not mark comment as read by user ${user.email} for comment ${commentId}`, error)
            throw error
        })
}

function performDoThing(thing, user) {
    thing.doers.push(user.id)
    thing.payload.status = TaskStatus.INPROGRESS.key
    return thing.save()
}

function performDismissThing(thing, user) {
    remove(thing.doers, doerId => doerId === user.id)
    thing.payload.status = TaskStatus.DISMISS.key
    return thing.save()
}

function performMarkThingAsDone(thing, user) {
    remove(thing.doers, doerId => doerId === user.id)
    thing.payload.status = TaskStatus.DONE.key
    return thing.save()
}

function performCloseThing(thing, user) {
    remove(thing.followUpers, followUperId => followUperId === user.id)
    thing.payload.status = TaskStatus.CLOSE.key
    return thing.save()
}

function performAbortThing(thing, user) {
    remove(thing.followUpers, followUperId => followUperId === user.id)
    thing.payload.status = TaskStatus.ABORT.key
    return thing.save()
}

module.exports = {
    getWhatsNew,
    getToDo,
    getFollowUps,
    doThing,
    dismissThing,
    markThingAsDone,
    createComment,
    markCommentAsRead,
    closeThing,
    abortThing,
    pingThing
}
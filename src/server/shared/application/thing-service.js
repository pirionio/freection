const {remove} = require('lodash')

const {Event, Thing, User} = require('../models')
const EventCreator = require('./event-creator')
const {eventToDto, thingToDto} = require('../transformers')
const ThingStatus = require('../../../common/enums/thing-status')
const ThingTypes = require('../../../common/enums/thing-types')
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

function getThing(user, thingId) {
    return Thing.getFullThing(thingId)
        .then(thing => thingToDto(thing, user))
        .catch(error => {
            logger.error(`error while fetching thing ${thingId} for user ${user.email}`, error)
            throw error
        })
}

function newThing(user, to, body, subject) {
    return User.getUserByEmail(to)
        .then(toUser => saveNewThing(body, subject, user, toUser))
        .then(thing => {
            return EventCreator.createCreated(user, thing)
                .then(() => {
                    //  if thing assigned to myself let's accept it immediately
                    if (thing.isSelf()) {
                        return EventCreator.createAccepted(user, thing)
                    }
                })
        })
}

function doThing(user, thingId) {
    return Thing.get(thingId).run()
        .then(thing => performDoThing(thing, user))
        .then(thing => EventCreator.createAccepted(user, thing))
        .then(() => Event.discardUserEventsByType(thingId, EventTypes.CREATED.key, user.id))
        .catch(error => {
            logger.error(`error while setting user ${user.email} as doer of thing ${thingId}:`, error)
            throw error
        }
    )
}

function dismiss(user, thingId) {
    return Thing.get(thingId).run()
        .then(thing => {
            return performDismiss(thing, user)
                .then(() => Event.discardAllUserEvents(thingId, user.id))
                .then(() => EventCreator.createDismissed(user, thing))
        })
        .catch(error => {
            logger.error(`error while dismissing thing ${thingId} by user ${user.email}`, error)
            throw error
        })
}

function close(user, thingId) {
    // TODO: check if the if the status is done

    return Thing.get(thingId).run()
        .then(thing => performClose(thing, user))
        .then(thing => EventCreator.createClosed(user, thing))
        .then(() => Event.discardAllUserEvents(thingId, user.id))
        .catch(error => {
            logger.error(`error while closing thing ${thingId} by user ${user.email}:`, error)
            throw error
        })
}

function abort(user, thingId) {
    // TODO: check if the if the status is done

    return Thing.get(thingId).run()
        .then(thing => {
            return performAbort(thing, user)
                .then(() => Event.discardAllUserEvents(thingId, user.id))
                .then(() => EventCreator.createAborted(user, thing))
        })
        .catch(error => {
            logger.error(`error while aborting thing ${thingId} by user ${user.email}:`, error)
            throw error
        })
}

function markAsDone(user, thingId) {
    return Thing.get(thingId).run()
        .then(thing => {
            return performMarkAsDone(thing, user)
                .then(() => Event.discardAllUserEvents(thingId, user.id))
                .then(() => EventCreator.createDone(user, thing))
                .then(() => {
                    if (thing.isSelf()) {
                        return EventCreator.createClosed(user, thing)
                    }
                })
        })
        .catch(error => {
            logger.error(`Error while marking thing ${thingId} as done by user ${user.email}:`, error)
            throw error
        })
}

function ping(user, thingId) {
    return Thing.get(thingId).run()
        .then(thing => EventCreator.createPing(user, thing))
        .then(event => Event.getFullEvent(event.id))
        .then(event => eventToDto(event, user, {includeThing: false}))
        .catch(error => {
            logger.error(`Error while pinging thing ${thingId} by user ${user.email}`, error)
            throw error
        })
}

function comment(user, thingId, commentText) {
    return Thing.get(thingId).run()
        .then(thing => EventCreator.createComment(user, thing, commentText))
        .then(event => Event.getFullEvent(event.id))
        .then(event => eventToDto(event, user, {includeThing: false}))
        .catch(error => {
            logger.error(`Could not comment on thing ${thingId} for user ${user.email}`, error)
            throw error
        })
}

function discardEventsByType(user, thingId, eventType) {
    return Event.discardUserEventsByType(thingId, eventType, user.id)
        .catch(error => {
            logger.error(`Could not discard events of type ${eventType} unread by user ${user.email} for thing ${thingId}`, error)
            throw error
        })
}

function saveNewThing(body, subject, creator, to) {
    const toUserId = to.id
    const creatorUserId = creator.id

    // check if thing is self thing (assigned to creator)
    const isSelfThing = toUserId === creatorUserId
    const status = isSelfThing ? ThingStatus.INPROGRESS.key : ThingStatus.NEW.key
    const followUpers = isSelfThing ? [] : [creatorUserId]
    const doers = isSelfThing ? [creatorUserId] : []

    return Thing.save({
        createdAt: new Date(),
        creatorUserId,
        toUserId,
        body,
        subject,
        followUpers,
        doers,
        type: ThingTypes.THING.key,
        payload: { status }
    })
}

function performDoThing(thing, user) {
    thing.doers.push(user.id)
    thing.payload.status = ThingStatus.INPROGRESS.key
    return thing.save()
}

function performDismiss(thing, user) {
    remove(thing.doers, doerId => doerId === user.id)
    thing.payload.status = ThingStatus.DISMISS.key
    return thing.save()
}

function performMarkAsDone(thing, user) {
    remove(thing.doers, doerId => doerId === user.id)
    thing.payload.status = thing.isSelf() ? ThingStatus.CLOSE.key : ThingStatus.DONE.key
    return thing.save()
}

function performClose(thing, user) {
    remove(thing.followUpers, followUperId => followUperId === user.id)
    thing.payload.status = ThingStatus.CLOSE.key
    return thing.save()
}

function performAbort(thing, user) {
    remove(thing.followUpers, followUperId => followUperId === user.id)
    remove(thing.doers, doerUserId => doerUserId === user.id)

    thing.payload.status = ThingStatus.ABORT.key
    return thing.save()
}

module.exports = {
    getWhatsNew,
    getToDo,
    getFollowUps,
    getThing,
    newThing,
    doThing,
    dismiss,
    markAsDone,
    comment,
    close,
    abort,
    ping,
    discardEventsByType
}
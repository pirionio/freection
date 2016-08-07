const {castArray, remove} = require('lodash')

const { Event, Thing } = require('../models')
const EventCreator = require('./event-creator')
const ThingStatus = require('../../../common/enums/thing-status')
const EntityTypes = require('../../../common/enums/entity-types')
const EventTypes = require('../../../common/enums/event-types')
const logger = require('../utils/logger')
const {userToCreator} = require('./creator-creator')

function newThing(creator, toUser, subject, body, id, number, url) {
    saveNewThing(creator, toUser, subject, body, id, number, url)
        .then(thing => {
            return EventCreator.createCreated(creator, thing, getShowNewList)
        })
}

function doThing(user, thingId) {
    const creator = userToCreator(user)

    return Thing.get(thingId).run()
        .then(validateType)
        .then(thing => validateStatus(thing, ThingStatus.NEW.key))
        .then(thing => performDoThing(thing, user))
        .then(thing => EventCreator.createAccepted(creator, thing, getShowNewList))
        .then(() => Event.discardUserEvents(thingId, user.id))
        .catch(error => {
                logger.error(`error while setting user ${user.email} as doer of github thing ${thingId}:`, error)
                throw error
            }
        )
}

function markAsDone(creator, thing) {
    validateStatus(thing, ThingStatus.INPROGRESS.key)

    return performMarkAsDone(thing)
        .then(() => EventCreator.createDone(creator, thing, getShowNewList))
        .catch(error => {
            logger.error(`Error while marking thing ${thing.id} as done by github:`, error)
            throw error
        })
}

function closeByGithub(creator, thing) {
    validateStatus(thing, ThingStatus.NEW.key)

    return performClose(thing, {id: thing.toUserId})
        .then(() => Event.discardUserEvents(thing.id, thing.toUserId))
        .then(() => EventCreator.createClosed(creator, thing, getShowNewList))
        .catch(error => {
            logger.error(`Error while closing thing ${thing.id} as done by github:`, error)
            throw error
        })
}

function dismiss(user, thingId) {
    const creator = userToCreator(user)

    return Thing.get(thingId).run()
        .then(validateType)
        .then(thing => validateStatus(thing, [ThingStatus.NEW.key, ThingStatus.INPROGRESS.key]))
        .then(thing => {
            return performDismiss(thing, user)
                .then(() => Event.discardUserEvents(thingId, user.id))
                .then(() => EventCreator.createDismissed(creator, thing, getShowNewList))
                .then(() => EventCreator.createClosed(creator, thing, getShowNewList))
        })
        .catch(error => {
            logger.error(`error while dismissing github thing ${thingId} by user ${user.email}`, error)
            throw error
        })
}

function close(user, thingId) {
    const creator = userToCreator(user)

    return Thing.get(thingId).run()
        .then(validateType)
        .then(thing => validateStatus(thing, ThingStatus.DONE.key))
        .then(thing => performClose(thing, user))
        .then(thing => EventCreator.createClosed(creator, thing, getShowNewList))
        .then(() => Event.discardUserEvents(thingId, user.id))
        .catch(error => {
            logger.error(`error while closing github thing ${thingId} by user ${user.email}:`, error)
            throw error
        })
}

function saveNewThing(creator, to, subject, body, id, number, url) {
    const toUserId = to.id

    return Thing.save({
        createdAt: new Date(),
        creatorUserId: null,
        toUserId,
        body,
        subject,
        followUpers: [],
        doers: [],
        type: EntityTypes.GITHUB.key,
        payload: {
            status: ThingStatus.NEW.key,
            creator,
            id,
            number,
            url
        }
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

function performClose(thing, user) {
    remove(thing.doers, doerId => doerId === user.id)
    thing.payload.status = ThingStatus.CLOSE.key
    return thing.save()
}

function performMarkAsDone(thing) {
    thing.payload.status = ThingStatus.DONE.key
    return thing.save()
}

function getShowNewList(user, thing, eventType) {

    switch (eventType) {
        case EventTypes.CREATED.key:
        case EventTypes.DONE.key:
            return [thing.toUserId]
        case EventTypes.ACCEPTED.key:
        case EventTypes.DISMISSED.key:
        case EventTypes.CLOSED.key:
            return []
        default:
            throw "UnknownEventType"
    }
}

function validateStatus(thing, allowedStatuses) {
    if (!castArray(allowedStatuses).includes(thing.payload.status))
        throw "IllegalOperation"

    return thing
}

function validateType(thing) {
    if (thing.type !== EntityTypes.GITHUB.key)
        throw 'InvalidEntityType'

    return thing
}

module.exports = {newThing, doThing, markAsDone, dismiss, close, closeByGithub}
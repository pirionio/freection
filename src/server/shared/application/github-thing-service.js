const {castArray, remove} = require('lodash')

const { Event, Thing } = require('../models')
const EventCreator = require('./event-creator')
const ThingStatus = require('../../../common/enums/thing-status')
const EntityTypes = require('../../../common/enums/entity-types')
const EventTypes = require('../../../common/enums/event-types')
const logger = require('../utils/logger')

function newThing(creator, assigner, toUser, subject, body, id, number, url) {
    saveNewThing(creator, assigner, toUser, subject, body, id, number, url)
        .then(thing => {
            return EventCreator.createCreated(toUser, thing, getShowNewList)
        })
}

function doThing(user, thingId) {
    return Thing.get(thingId).run()
        .then(validateType)
        .then(thing => validateStatus(thing, ThingStatus.NEW.key))
        .then(thing => performDoThing(thing, user))
        .then(thing => EventCreator.createAccepted(user, thing, getShowNewList))
        .then(() => Event.discardUserEvents(thingId, user.id))
        .catch(error => {
                logger.error(`error while setting user ${user.email} as doer of github thing ${thingId}:`, error)
                throw error
            }
        )
}

function markAsDone(thing) {
    validateStatus(thing, ThingStatus.INPROGRESS.key)

    return performMarkAsDone(thing, {id: thing.toUserId})
        .then(() => EventCreator.createDone({id: thing.toUserId}, thing, getShowNewList))
        .catch(error => {
            logger.error(`Error while marking thing ${thing.id} as done by github:`, error)
            throw error
        })
}

function closeByGithub(thing) {
    validateStatus(thing, ThingStatus.NEW.key)

    return performClose(thing, {id: thing.toUserId})
        .then(() => Event.discardUserEvents(thing.id, thing.toUserId))
        .then(() => EventCreator.createClosed({id: thing.toUserId}, thing, getShowNewList))
        .catch(error => {
            logger.error(`Error while closing thing ${thing.id} as done by github:`, error)
            throw error
        })
}

function dismiss(user, thingId) {
    return Thing.get(thingId).run()
        .then(validateType)
        .then(thing => validateStatus(thing, [ThingStatus.NEW.key, ThingStatus.INPROGRESS.key]))
        .then(thing => {
            return performDismiss(thing, user)
                .then(() => Event.discardUserEvents(thingId, user.id))
                .then(() => EventCreator.createDismissed(user, thing, getShowNewList))
                .then(() => EventCreator.createClosed(user, thing, getShowNewList))
        })
        .catch(error => {
            logger.error(`error while dismissing github thing ${thingId} by user ${user.email}`, error)
            throw error
        })
}

function close(user, thingId) {
    return Thing.get(thingId).run()
        .then(validateType)
        .then(thing => validateStatus(thing, ThingStatus.DONE.key))
        .then(thing => performClose(thing, user))
        .then(thing => EventCreator.createClosed(user, thing, getShowNewList))
        .then(() => Event.discardUserEvents(thingId, user.id))
        .catch(error => {
            logger.error(`error while closing github thing ${thingId} by user ${user.email}:`, error)
            throw error
        })
}

function saveNewThing(creator, assigner, to, subject, body, id, number, url) {
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
            assigner,
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

function performMarkAsDone(thing, user) {
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
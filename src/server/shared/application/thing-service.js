const {remove, castArray, union} = require('lodash')

const {Event, Thing, User} = require('../models')
const EventCreator = require('./event-creator')
const {eventToDto, thingToDto} = require('../transformers')
const ThingStatus = require('../../../common/enums/thing-status')
const EntityTypes = require('../../../common/enums/entity-types')
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
            return EventCreator.createCreated(user, thing, getShowNewList)
                .then(() => {
                    //  if thing assigned to myself let's accept it immediately
                    if (thing.isSelf()) {
                        return EventCreator.createAccepted(user, thing, getShowNewList)
                    }
                })
        })
}

function doThing(user, thingId) {

    return Thing.get(thingId).run()
        .then(validateType)
        .then(thing => validateStatus(thing, [ThingStatus.NEW.key, ThingStatus.REOPENED.key]))
        .then(thing => performDoThing(thing, user))
        .then(thing => EventCreator.createAccepted(user, thing, getShowNewList))
        .then(() => Event.discardUserEvents(thingId, user.id))
        .catch(error => {
            logger.error(`error while setting user ${user.email} as doer of thing ${thingId}:`, error)
            throw error
        }
    )
}

function dismiss(user, thingId) {
    return Thing.get(thingId).run()
        .then(validateType)
        .then(thing => validateStatus(thing, [ThingStatus.NEW.key, ThingStatus.REOPENED.key, ThingStatus.INPROGRESS.key ]))
        .then(thing => {
            return performDismiss(thing, user)
                .then(() => Event.discardUserEvents(thingId, user.id))
                .then(() => EventCreator.createDismissed(user, thing, getShowNewList))
        })
        .catch(error => {
            logger.error(`error while dismissing thing ${thingId} by user ${user.email}`, error)
            throw error
        })
}

function close(user, thingId) {
    return Thing.get(thingId).run()
        .then(validateType)
        .then(thing => validateStatus(thing, [ThingStatus.DONE.key, ThingStatus.DISMISS.key]))
        .then(thing => performClose(thing, user))
        .then(thing => EventCreator.createClosed(user, thing, getShowNewList))
        .then(() => Event.discardUserEvents(thingId, user.id))
        .catch(error => {
            logger.error(`error while closing thing ${thingId} by user ${user.email}:`, error)
            throw error
        })
}

function cancel(user, thingId) {
    return Thing.get(thingId).run()
        .then(thing => validateStatus(thing, [ThingStatus.NEW.key, ThingStatus.REOPENED.key, ThingStatus.INPROGRESS.key]))
        .then(thing => {
            return performCancel(thing, user)
                .then(() => Event.discardThingEvents(thingId, user.id))
                .then(() => EventCreator.createCanceled(user, thing, getShowNewList))
        })
        .catch(error => {
            logger.error(`error while canceling thing ${thingId} by user ${user.email}:`, error)
            throw error
        })
}

function cancelAck(user, thingId) {
    return Thing.get(thingId).run()
        .then(thing => {
            return performCancelAck(thing, user)
                .then(() => Event.discardUserEventsByType(thingId, EventTypes.CANCELED.key, user.id))
                .then(() => EventCreator.createCancelAck(user, thing, getShowNewList))
        })
        .catch(error => {
            logger.error(`error while accepting cancellation of thing ${thingId} by user ${user.email}:`, error)
            throw error
        })
}

function markAsDone(user, thingId) {
    return Thing.get(thingId).run()
        .then(thing => validateStatus(thing, [ThingStatus.NEW.key, ThingStatus.REOPENED.key, ThingStatus.INPROGRESS.key]))
        .then(thing => {
            return performMarkAsDone(thing, user)
                .then(() => Event.discardUserEvents(thingId, user.id))
                .then(() => EventCreator.createDone(user, thing, getShowNewList))
                .then(() => {
                    if (thing.isSelf()) {
                        return EventCreator.createClosed(user, thing, getShowNewList)
                    }
                })
        })
        .catch(error => {
            logger.error(`Error while marking thing ${thingId} as done by user ${user.email}:`, error)
            throw error
        })
}

function sendBack(user, thingId) {
    return Thing.get(thingId).run()
        .then(thing => validateStatus(thing, [ThingStatus.DONE.key, ThingStatus.DISMISS.key]))
        .then(thing => {
            return performSendBack(thing)
                .then(() => Event.discardUserEvents(thingId, user.id))
                .then(() => EventCreator.createSentBack(user, thing, getShowNewList))
        })
        .catch(error => {
            logger.error(`Error while sending thing ${thingId} back by user ${user.email}:`, error)
            throw error
        })
}

function ping(user, thingId) {
    return Thing.get(thingId).run()
        .then(thing => validateStatus(thing, ThingStatus.INPROGRESS.key))
        .then(thing => EventCreator.createPing(user, thing, getShowNewList))
        .then(event => Event.getFullEvent(event.id))
        .then(event => eventToDto(event, user, {includeThing: false}))
        .catch(error => {
            logger.error(`Error while pinging thing ${thingId} by user ${user.email}`, error)
            throw error
        })
}

function comment(user, thingId, commentText) {
    return Thing.get(thingId).run()
        .then(thing => EventCreator.createComment(user, thing, getShowNewList, commentText))
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
    const creatorUserId = creator ? creator.id : null

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
        type: EntityTypes.THING.key,
        payload: { status }
    })
}

function getShowNewList(user, thing, eventType) {
    if (thing.isSelf())
        return []

    switch (eventType) {
        case EventTypes.CREATED.key:
            return [thing.toUserId]
        case EventTypes.DISMISSED.key:
        case EventTypes.DONE.key:
            return [thing.creatorUserId]
        case EventTypes.CANCELED.key:
        case EventTypes.SENT_BACK.key:
            return union(thing.doers, [thing.toUserId])
        case EventTypes.COMMENT.key:
            return union(thing.followUpers, thing.doers, [thing.creatorUserId]).filter(userId => userId !== user.id)
        case EventTypes.PING.key:
            return  [...thing.doers]
        case EventTypes.ACCEPTED.key:
        case EventTypes.CLOSED.key:
        case EventTypes.CANCEL_ACKED.key:
            return []
        default:
            throw "UnknownEventType"
    }
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

function performCancel(thing, user) {
    remove(thing.followUpers, followUperId => followUperId === user.id)
    remove(thing.doers, doerUserId => doerUserId === user.id)

    thing.payload.status = ThingStatus.CANCELED.key
    return thing.save()
}

function performSendBack(thing) {
    thing.payload.status = ThingStatus.REOPENED.key
    return thing.save()
}

function performCancelAck(thing, user) {
    remove(thing.doers, doerUserId => doerUserId === user.id)
    return thing.save()
}

function validateStatus(thing, allowedStatuses) {
    if (!castArray(allowedStatuses).includes(thing.payload.status))
        throw "IllegalOperation"

    return thing
}

function validateType(thing) {
    if (thing.type !== EntityTypes.THING.key)
        throw 'InvalidEntityType'

    return thing
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
    sendBack,
    comment,
    close,
    cancel,
    cancelAck,
    ping,
    discardEventsByType
}
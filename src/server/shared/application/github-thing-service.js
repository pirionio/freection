import {castArray, uniq} from 'lodash'

import { Event, Thing } from '../models'
import * as EventCreator from './event-creator'
import ThingStatus from '../../../common/enums/thing-status'
import EntityTypes from '../../../common/enums/entity-types'
import EventTypes from '../../../common/enums/event-types'
import logger from '../utils/logger'
import {userToAddress} from './address-creator'

export function newThing(creator, toUser, subject, body, id, number, url) {
    saveNewThing(creator, userToAddress(toUser), subject, body, id, number, url)
        .then(thing => {
            return EventCreator.createCreated(creator, thing, getShowNewList)
        })
}

export async function doThing(user, thingId) {
    const creator = userToAddress(user)

    try {
        const thing = await Thing.getFullThing(thingId)

        if (thing.type !== EntityTypes.GITHUB.key)
            throw 'InvalidEntityType'

        validateStatus(thing, [ThingStatus.NEW.key])

        thing.doers.push(user.id)
        thing.payload.status = ThingStatus.INPROGRESS.key
        thing.events.push(EventCreator.createAccepted(creator, thing, []))
        discardUserFromThingEvents(user, thing)

        await thing.saveAll()

        return thing
    } catch(error) {
        logger.error(`error while setting user ${user.email} as doer of github thing ${thingId}:`, error)
        throw error
    }
}

export function markAsDone(creator, thing) {
    validateStatus(thing, ThingStatus.INPROGRESS.key)

    return performMarkAsDone(thing)
        .then(() => EventCreator.createDone(creator, thing, getShowNewList))
        .catch(error => {
            logger.error(`Error while marking thing ${thing.id} as done by github:`, error)
            throw error
        })
}

export function closeByGithub(creator, thing) {
    validateStatus(thing, ThingStatus.NEW.key)

    return performClose(thing)
        .then(() => Event.discardThingEvents(thing.id))
        .then(() => EventCreator.createClosed(creator, thing, getShowNewList))
        .catch(error => {
            logger.error(`Error while closing thing ${thing.id} as done by github:`, error)
            throw error
        })
}

export function dismiss(user, thingId) {
    const creator = userToAddress(user)

    return Thing.get(thingId).run()
        .then(validateType)
        .then(thing => validateStatus(thing, [ThingStatus.NEW.key, ThingStatus.INPROGRESS.key]))
        .then(thing => {
            return performDismiss(thing)
                .then(() => Event.discardUserEvents(thingId, user.id))
                .then(() => EventCreator.createDismissed(creator, thing, getShowNewList))
                .then(() => EventCreator.createClosed(creator, thing, getShowNewList))
        })
        .catch(error => {
            logger.error(`error while dismissing github thing ${thingId} by user ${user.email}`, error)
            throw error
        })
}

export function close(user, thingId) {
    const creator = userToAddress(user)

    return Thing.get(thingId).run()
        .then(validateType)
        .then(thing => validateStatus(thing, ThingStatus.DONE.key))
        .then(thing => performClose(thing))
        .then(thing => EventCreator.createClosed(creator, thing, getShowNewList))
        .then(() => Event.discardUserEvents(thingId, user.id))
        .catch(error => {
            logger.error(`error while closing github thing ${thingId} by user ${user.email}:`, error)
            throw error
        })
}

function saveNewThing(creator, to, subject, body, id, number, url) {

    return Thing.save({
        createdAt: new Date(),
        creator,
        to,
        body,
        subject,
        followUpers: [],
        doers: [],
        all: uniq([creator.id, to.id]),
        type: EntityTypes.GITHUB.key,
        payload: {
            status: ThingStatus.NEW.key,
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

function performDismiss(thing) {
    thing.doers = []
    thing.payload.status = ThingStatus.DISMISS.key
    return thing.save()
}

function performClose(thing) {
    thing.doers = []
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
            return [thing.to.id]
        case EventTypes.ACCEPTED.key:
        case EventTypes.DISMISSED.key:
        case EventTypes.CLOSED.key:
            return []
        default:
            throw 'UnknownEventType'
    }
}

function validateStatus(thing, allowedStatuses) {
    if (!castArray(allowedStatuses).includes(thing.payload.status))
        throw 'IllegalOperation'

    return thing
}

function validateType(thing) {
    if (thing.type !== EntityTypes.GITHUB.key)
        throw 'InvalidEntityType'

    return thing
}

function discardUserFromThingEvents(user, thing) {
    thing.events = thing.events.map(event => {
        event.showNewList = event.showNewList.filter(userId => userId !== user.id)
        return event
    })
}
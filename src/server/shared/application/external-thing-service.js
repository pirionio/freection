import {castArray, uniq, remove} from 'lodash'

import {Event, User} from '../models'
import * as ThingDomain from '../domain/thing-domain'
import * as ThingHelper from '../../../common/helpers/thing-helper'
import * as EventCreator from './event-creator'
import ThingStatus from '../../../common/enums/thing-status'
import EntityTypes from '../../../common/enums/entity-types'
import logger from '../utils/logger'
import {userToAddress} from './address-creator'
import * as AsanaService from '../technical/asana-service'

export async function newThing(creator, toUser, subject, body, id, url, source) {
    const thing = saveNewThing(creator, userToAddress(toUser), subject, body, id, url, source)
    thing.events.push(EventCreator.createCreated(creator, thing, [thing.to.id]))
    await ThingDomain.updateThing(thing)
    return thing.events[0]
}

export async function doThing(user, thingId) {
    const creator = userToAddress(user)

    try {
        const thing = await ThingDomain.getFullThing(thingId)

        validateType(thing)
        validateStatus(thing, [ThingStatus.NEW.key])

        thing.doers.push(user.id)
        thing.payload.status = ThingStatus.INPROGRESS.key
        thing.events.push(EventCreator.createAccepted(creator, thing, []))
        ThingHelper.discardUserEvents(user, thing)

        await ThingDomain.updateThing(thing)

        return thing
    } catch(error) {
        logger.error(`error while setting user ${user.email} as doer of external thing ${thingId}:`, error)
        throw error
    }
}

export async function markAsDone(userToken, thingId) {
    const creator = userToAddress(userToken)

    try {
        const thing = await ThingDomain.getFullThing(thingId)

        validateStatus(thing, [ThingStatus.NEW.key, ThingStatus.INPROGRESS.key])

        // Notice we won't proceed with updating Freection, if the action in Asana failed.
        // TODO we do need, however, to convey the error message better to the user, whose task won't disappear
        const user = await User.get(userToken.id)
        await closeExternalTask(user, thing.payload.id)

        remove(thing.doers, doerId => doerId === userToken.id)
        thing.payload.status = ThingStatus.DONE.key
        thing.events.push(EventCreator.createDone(creator, thing, []))

        return await ThingDomain.updateThing(thing)
    } catch(error) {
        logger.error(`Error while marking thing ${thingId} as done by external:`, error)
        throw error
    }
}

export async function markExternalAsDone(creator, thing) {
    try {
        validateStatus(thing, ThingStatus.INPROGRESS.key)

        thing.payload.status = ThingStatus.DONE.key
        thing.events.push(EventCreator.createDone(creator, thing, [thing.to.id]))

        return await ThingDomain.updateThing(thing)
    } catch(error) {
        logger.error(`Error while marking thing ${thing.id} as done by external:`, error)
        throw error
    }
}

async function closeExternalTask(user, taskId) {
    const client = AsanaService.createClient(user)

    try {
        const result = await client.tasks.update(taskId, {
            completed: true
        })

        logger.info(`Asana - closed task ${taskId} after close action in Freection - result:`, result)
    } catch (error) {
        logger.error(`Asana - could not close task ${taskId} after close action in Freection - error:`, error)
        throw error
    }
}

export async function closeByExternal(creator, thing) {
    try {
        validateStatus(thing, ThingStatus.NEW.key)

        thing.doers = []
        thing.payload.status = ThingStatus.CLOSE.key

        thing.events.push(EventCreator.createClosed(creator, thing, []))
        ThingHelper.discardAllThingEvents(thing)

        await ThingDomain.updateThing(thing)

        return thing
    } catch(error) {
        logger.error(`Error while closing thing ${thing.id} as done by external:`, error)
        throw error
    }
}

export async function dismiss(user, thingId) {
    const creator = userToAddress(user)

    try {
        const thing = await ThingDomain.getFullThing(thingId)
        validateType(thing)

        // Validate that the status of the thing matched the action
        validateStatus(thing, [ThingStatus.NEW.key, ThingStatus.INPROGRESS.key])

        thing.doers = []
        thing.payload.status = ThingStatus.DISMISS.key
        thing.events.push(EventCreator.createDismissed(creator, thing, []))
        thing.events.push(EventCreator.createClosedSync(creator, thing, []))
        ThingHelper.discardUserEvents(user, thing)

        await ThingDomain.updateThing(thing)

        return thing
    } catch(error) {
        logger.error(`error while dismissing external thing ${thingId} by user ${user.email}`, error)
        throw error
    }
}

export async function close(user, thingId) {
    const creator = userToAddress(user)

    try {
        const thing = await ThingDomain.getFullThing(thingId)

        validateType(thing)
        validateStatus(thing, ThingStatus.DONE.key)

        thing.doers = []
        thing.payload.status = ThingStatus.CLOSE.key

        thing.events.push(EventCreator.createClosed(creator, thing, []))
        ThingHelper.discardUserEvents(user, thing)

        await ThingDomain.updateThing(thing)

        return thing
    } catch(error) {
        logger.error(`error while closing external thing ${thingId} by user ${user.email}:`, error)
        throw error
    }
}

export async function unassign(user, creator, thingId) {
    try {
        const thing = await ThingDomain.getFullThing(thingId)

        validateType(thing)

        thing.events.push(EventCreator.createUnassigned(creator, thing, [user.id], user))

        await ThingDomain.updateThing(thing)

        return thing
    } catch(error) {
        logger.error(`error while unassigning external thing ${thingId} by user ${creator.displayName} for user ${user.email}:`, error)
        throw error
    }
}

function saveNewThing(creator, to, subject, body, id, url, source) {
    return ThingDomain.createThing({
        createdAt: new Date(),
        creator,
        to,
        body,
        subject,
        followUpers: [],
        doers: [],
        subscribers: [],
        all: uniq([creator.id, to.id]),
        type: EntityTypes.EXTERNAL.key,
        payload: {
            status: ThingStatus.NEW.key,
            id,
            url,
            source
        },
        events: []
    })
}

function validateStatus(thing, allowedStatuses) {
    if (!castArray(allowedStatuses).includes(thing.payload.status))
        throw 'IllegalOperation'

    return thing
}

function validateType(thing) {
    if (![EntityTypes.EXTERNAL.key, EntityTypes.GITHUB.key].includes(thing.type))
        throw 'InvalidEntityType'
}
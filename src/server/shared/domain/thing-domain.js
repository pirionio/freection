import {Thing, Event, User} from '../models'

export function createThing(thing) {
    return new Thing(thing)
}

export async function updateThing(thing) {
    return thing.saveAll()
}

export async function getThing(thingId) {
    return Thing.get(thingId).run()
}

export async function getFullThing(thingId) {
    return Thing.get(thingId).getJoin({events: true}).run()
}

export async function getAllUserThings(userId) {
    return Thing.getAll(userId, {index: 'all'}).getJoin({events: true}).run()
}

export async function getUserFollowUps(userId) {
    return Thing.getAll(userId, {index: 'followUpers'}).getJoin({events: true}).run()
}

export async function getUserToDos(userId) {
    return Thing.getAll(userId, {index: 'doers'}).getJoin({events: true}).run()
}

export async function getThingsByExternalId(externalId, full = false) {
    if (full) {
        return Thing.getAll(externalId, {index: 'externalId'}).getJoin({events: true}).run()
    }

    return Thing.getAll(externalId, {index: 'externalId'}).run()
}

export async function getUserThingByExternalId(externalId, userId) {
    const things = await Thing.getAll(externalId, {index: 'externalId'}).filter({to: {id: userId}}).run()
    if (things && things.length > 0)
        return things[0]

    return null
}

export async function getThingByThreadId(threadId) {
    return Thing.getAll(threadId, {index: 'threadId'}).run().then(things => {
        if (things.length === 0)
            return null

        return things[0]
    })
}

import {Thing, Event, User} from '../models'

export async function createThing(thing) {
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

export async function getThingsByGithubIssueId(githubIssueId, full = false) {
    if (full) {
        return Thing.getAll(githubIssueId, {index: 'githubIssueId'}).getJoin({events: true}).run()
    }

    return Thing.getAll(githubIssueId, {index: 'githubIssueId'}).run()
}

export async function getThingByThreadId(threadId) {
    return Thing.getAll(threadId, {index: 'threadId'}).run().then(things => {
        if (things.length === 0)
            return null

        return things[0]
    })
}

import thinky from './thinky'

import EntityType from '../../../common/enums/entity-types'

const type = thinky.type

const Thing = thinky.createModel('Thing', {
    id: type.string(),
    createdAt: type.date().required(),
    creator: {
        id: type.string(),
        type: type.string().required(),
        displayName: type.string().required(),
        payload: type.object()
    },
    to: {
        id: type.string(),
        type: type.string().required(),
        displayName: type.string().required(),
        payload: type.object()
    },
    body: type.string(),
    subject: type.string().required(),
    doers: [type.string()],
    followUpers: [type.string()],
    mentioned: [type.string()],
    subscribers: [type.string()],
    all: [type.string()],
    payload: type.object(),
    type: type.string()
})

Thing.ensureIndex('followUpers', doc => {
    return doc('followUpers')
}, {multi: true})

Thing.ensureIndex('doers', doc => {
    return doc('doers')
}, {multi: true})

Thing.ensureIndex('mentioned', doc => {
    return doc('mentioned')
}, {multi: true})

Thing.ensureIndex('all', doc => {
    return doc('all')
}, {multi: true})

Thing.ensureIndex('githubIssueId', doc => {
    return thinky.r.branch(doc('type').eq(EntityType.GITHUB.key), doc('payload')('id'), null)
})

Thing.ensureIndex('threadId', doc => {
    return doc('payload')('threadId')
})

Thing.defineStatic('getFullThing', function(thingId) {
    return this.get(thingId).getJoin({events: true}).run()
})

Thing.defineStatic('getAllUserThings', function(userId) {
    return this.getAll(userId, {index: 'all'}).getJoin({events: true}).run()
})

Thing.defineStatic('getUserFollowUps', function(userId) {
    return this.getAll(userId, {index: 'followUpers'}).getJoin({events: true}).run()
})

Thing.defineStatic('getUserToDos', function(userId) {
    return this.getAll(userId, {index: 'doers'}).getJoin({events: true}).run()
})

Thing.defineStatic('getUserMentions', function(userId) {
    return this.getAll(userId, {index: 'mentioned'}).getJoin({events: true}).run()
})

Thing.defineStatic('getThingsByGithubIssueId', function(githubIssueId) {
    return this.getAll(githubIssueId, {index: 'githubIssueId'}).run()
})

Thing.defineStatic('getThingByThreadId', function(threadId) {
    return this.getAll(threadId, {index: 'threadId'}).run().then(things => {
        if (things.length === 0)
            return null

        return things[0]
    })
})

export default Thing
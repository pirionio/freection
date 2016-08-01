const thinky = require('./thinky')
const type = thinky.type

const User = require('./User')
const EventTypes = require('../../../common/enums/event-types')
const EntityTypes = require('../../../common/enums/entity-types')

const Thing = thinky.createModel('Thing', {
    id: type.string(),
    createdAt: type.date().required(),
    creatorUserId: type.string().required(),
    toUserId: type.string().required(),
    body: type.string(),
    subject: type.string().required(),
    doers: [type.string()],
    followUpers: [type.string()],
    payload: type.object(),
    type: type.string()
})

Thing.ensureIndex('followUpers', function(doc) {
    return doc('followUpers')
}, {multi:true})

Thing.ensureIndex('doers', function(doc) {
    return doc('doers')
}, {multi:true})

Thing.ensureIndex('githubIssueId', function(doc) {
    return thinky.r.branch(doc('type').eq('GITHUB'), doc('payload')('id'), null)
})

Thing.defineStatic('getFullThing', function(thingId) {
    return this.get(thingId).getJoin({to: true, creator: true, events: {
        _apply: sequence => sequence.getJoin({creator: true})
    }}).run()
})

Thing.defineStatic('getUserFollowUps', function(userId) {
    return this.getAll(userId, {index: 'followUpers'}).getJoin({to: true, creator: true, events: true}).run()
})

Thing.defineStatic('getUserToDos', function(userId) {
    return this.getAll(userId, {index: 'doers'}).getJoin({creator: true, to: true, events: true}).run()
})

Thing.defineStatic('getThingsByGithubIssueId', function(githubIssueId) {
    return this.getAll(githubIssueId, {index: 'githubIssueId'}).run()
})

Thing.define('isSelf', function() {
    return this.creatorUserId === this.toUserId
})

module.exports = Thing
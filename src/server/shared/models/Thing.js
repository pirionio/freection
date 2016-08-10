const thinky = require('./thinky')
const type = thinky.type

const User = require('./User')
const EventTypes = require('../../../common/enums/event-types')
const EntityTypes = require('../../../common/enums/entity-types')

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

Thing.ensureIndex('thingsWithEmail', function(doc) {
    return thinky.r
        .branch(thinky.r.and(
            doc('type').eq('THING'),
            doc('to')('type').eq('EMAIL'),
            doc('payload')('status').ne('CLOSE')),
            doc('creator')('id'), null)
})

Thing.defineStatic('getFullThing', function(thingId) {
    return this.get(thingId).getJoin({events: true}).run()
})

Thing.defineStatic('getUserFollowUps', function(userId) {
    return this.getAll(userId, {index: 'followUpers'}).getJoin({events: true}).run()
})

Thing.defineStatic('getUserToDos', function(userId) {
    return this.getAll(userId, {index: 'doers'}).getJoin({events: true}).run()
})

Thing.defineStatic('getThingsByGithubIssueId', function(githubIssueId) {
    return this.getAll(githubIssueId, {index: 'githubIssueId'}).run()
})

Thing.defineStatic('getThingsWithEmailByUser', function(userId) {
    return this.getAll(userId, {index: 'thingsWithEmail'}).run()
})

Thing.define('isSelf', function() {
    return this.creator.id === this.to.id && this.creator.type === this.to.type
})

Thing.define('getEmailId', function () {
    const email = this.creator.payload.email
    const domain = email.substr(email.indexOf('@'))

    return `thing/${this.id}${domain}`
})

module.exports = Thing
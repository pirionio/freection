const thinky = require('./thinky')
const type = thinky.type

const User = require('./User')
const EventTypes = require('../../../common/enums/event-types')

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

Thing.defineStatic('getFullThing', function(thingId) {
    return this.get(thingId).getJoin({to: true, creator: true, events: {
        _apply: sequence => sequence.filter({eventType: EventTypes.COMMENT.key}).getJoin({creator: true})
    }}).run()
})

Thing.defineStatic('getUserFollowUps', function(userId) {
    return this.getAll(userId, {index: 'followUpers'}).getJoin({to: true, creator: true, events: {
        _apply: sequence => sequence.filter({eventType: EventTypes.COMMENT.key})
    }}).run()
})

Thing.defineStatic('getUserToDos', function(userId) {
    return this.getAll(userId, {index: 'doers'}).getJoin({creator: true, to: true, events: {
        _apply: sequence => sequence.filter({eventType: EventTypes.COMMENT.key})
    }}).run()
})

module.exports = Thing
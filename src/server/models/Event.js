const thinky = require('./thinky')
const type = thinky.type
const Thing = require('./Thing')
const User = require('./User')
const EventTypes = require('../../common/enums/event-types')

const Event = thinky.createModel('Event', {
    id: type.string(),
    thingId: type.string().required(),
    creatorUserId: type.string().required(),
    eventType: type.string().required(),
    createdAt: type.date().required(),
    payload: type.object(),
    readList: [type.string()]
})

Event.belongsTo(Thing, 'thing', 'thingId', 'id')
Event.belongsTo(User, 'creator', 'creatorUserId', 'id')

Event.ensureIndex('thingId')
Event.ensureIndex('eventType')

Event.ensureIndex('whatsnew', function(doc) {
    return doc('readList')
}, {multi: true})

Event.defineStatic('getFullEvent', function(eventId) {
    return this.get(eventId).getJoin({creator: true, thing: true}).run()
})

Event.defineStatic('getWhatsNew', function(userId) {
    return this.getAll(userId, {index: 'whatsnew'}).
        getJoin({thing: {creator: true, to: true}, creator: true}).
        run()
    })

Event.defineStatic('getCommentsForThing', function(thingId) {
    return this.filter({thingId, eventType: EventTypes.COMMENT.key}).
        getJoin({creator: true}).
        run()
    })

module.exports = Event

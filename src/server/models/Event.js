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

Event.ensureIndex('thingId', {multi: true})
Event.ensureIndex('eventType', {multi: true})

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

Event.defineStatic('markAllThingEventsAsRead', function(thingId) {
    return this.getAll(thingId, {index: 'thingId'}).update({readList: []}).run()
    })

module.exports = Event

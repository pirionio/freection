const thinky = require('./thinky')
const type = thinky.type

const User = require('./User')

const Event = thinky.createModel('Event', {
    id: type.string(),
    thingId: type.string().required(),
    creator: {
        id: type.string(),
        type: type.string().required(),
        displayName: type.string().required(),
        payload: type.object()
    },
    eventType: type.string().required(),
    createdAt: type.date().required(),
    payload: type.object(),
    showNewList: [type.string()]
})

Event.ensureIndex('thingId', {multi: true})
Event.ensureIndex('thingIdEventType', function(doc) {
    return [doc('thingId'), doc('eventType')]
})

Event.ensureIndex('whatsnew', function(doc) {
    return doc('showNewList')
}, {multi: true})

Event.defineStatic('getFullEvent', function(eventId) {
    return this.get(eventId).getJoin({
        thing: {
            creator:true,
            to: true
        }
    }).run()
})

Event.defineStatic('getAllChanges', function() {
    return this.getJoin({thing: true}).changes()
})

Event.defineStatic('getWhatsNew', function(userId) {
    return this.getAll(userId, {index: 'whatsnew'}).
        getJoin({thing: {to: true}}).
        run()
    })

Event.defineStatic('discardUserEvents', function (thingId, userId) {
    return this.getAll(thingId, {index: 'thingId'})
        .update(event => {
            return {
                showNewList: event("showNewList").filter(readerUserId => readerUserId.ne(userId))
            }
        }).run()
})

Event.defineStatic('discardThingEvents', function (thingId) {
    return this.getAll(thingId, {index: 'thingId'})
        .update(event => {
            return {
                showNewList: []
            }
        }).run()
})

Event.defineStatic('discardUserEventsByType', function (thingId, eventType, userId) {
    return this.getAll([thingId, eventType], {index: 'thingIdEventType'})
        .update(event => {
            return {
                showNewList: event("showNewList").filter(readerUserId => readerUserId.ne(userId))
            }
        }).run()
})

Event.defineStatic('discardUserEventById', function (eventId, userId) {
    return this.get(eventId).update(event => {
        return {
            showNewList: event("showNewList").filter(readerUserId => readerUserId.ne(userId))
        }
    }).run()
})

Event.defineStatic('markAsRead', function(eventId, userId) {
    return this.get(eventId).update(event => {
        return {
            payload: {
                readByList: event('payload')('readByList').append(userId)
            }
        }
    }).run()
})

module.exports = Event

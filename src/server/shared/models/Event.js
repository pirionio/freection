const thinky = require('./thinky')
const type = thinky.type

const User = require('./User')
const EventTypes = require('../../../common/enums/event-types')

const Event = thinky.createModel('Event', {
    id: type.string(),
    thingId: type.string().required(),
    creatorUserId: type.string().required(),
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
        creator: true,
        thing: {
            creator:true,
            to: true
        }
    }).run()
})

Event.defineStatic('getAllChanges', function() {
    return this.getJoin({creator: true, thing: true}).changes()
})

Event.defineStatic('getWhatsNew', function(userId) {
    return this.getAll(userId, {index: 'whatsnew'}).
        getJoin({thing: {creator: true, to: true}, creator: true}).
        run()
    })

Event.defineStatic('discardAllUserEvents', function (thingId, userId) {
    return this.getAll(thingId, {index: 'thingId'})
        .update(event => {
            return {
                showNewList: event("showNewList").filter(readerUserId => readerUserId.ne(userId))
            }
        }).run()
})

Event.defineStatic('discardUserEventByType', function (thingId, eventType, userId) {
    return this.getAll([thingId, eventType], {index: 'thingIdEventType'})
        .update(event => {
            return {
                showNewList: event("showNewList").filter(readerUserId => readerUserId.ne(userId))
            }
        }).run()
})

Event.defineStatic('markUserCommentAsRead', function(eventId, userId) {
    return this.get(eventId)
        .update(event => {
            return {
                payload: {
                    readByList: event('payload')('readByList').append(userId)
                }
            }
        })
        .run()
})

module.exports = Event

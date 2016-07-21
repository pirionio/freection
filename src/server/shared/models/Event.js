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
Event.ensureIndex('eventType', {multi: true})

Event.ensureIndex('whatsnew', function(doc) {
    return doc('showNewList')
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
    return this.getAll(thingId, {index: 'thingId'}).update({showNewList: []}).run()
    })

Event.defineStatic('markUserThingEventsAsRead', function(thingId, userId) {
    return this.filter(event =>
        event('showNewList').contains(userId) && event('thingId').eq(thingId) && event('eventType').eq(EventTypes.COMMENT.key)
    ).update(event => {
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

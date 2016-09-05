import thinky from './thinky'

const type = thinky.type

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
Event.ensureIndex('thingIdEventType', doc => {
    return [doc('thingId'), doc('eventType')]
})

Event.ensureIndex('whatsnew', doc => {
    return doc('showNewList')
}, {multi: true})

Event.defineStatic('getFullEvent', function(eventId) {
    return this.get(eventId).getJoin({
        thing: true
    }).run()
})

Event.defineStatic('getAllChanges', function() {
    return this.getJoin({thing: true}).changes()
})

Event.defineStatic('getWhatsNew', function(userId) {
    return this.getAll(userId, {index: 'whatsnew'})
        .getJoin({thing: true})
        .run()
})

Event.defineStatic('discardUserEvents', function(thingId, userId) {
    return this.getAll(thingId, {index: 'thingId'})
        .update(event => {
            return {
                showNewList: event('showNewList').filter(readerUserId => readerUserId.ne(userId))
            }
        }).run()
})

Event.defineStatic('discardThingEvents', function(thingId) {
    return this.getAll(thingId, {index: 'thingId'})
        .update(() => {
            return {
                showNewList: []
            }
        }).run()
})

Event.defineStatic('discardUserEventsByType', function(thingId, eventType, userId) {
    return this.getAll([thingId, eventType], {index: 'thingIdEventType'})
        .update(event => {
            return {
                showNewList: event('showNewList').filter(readerUserId => readerUserId.ne(userId))
            }
        }).run()
})

Event.defineStatic('discardUserEventById', function(eventId, userId) {
    return this.get(eventId).update(event => {
        return {
            showNewList: event('showNewList').filter(readerUserId => readerUserId.ne(userId))
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

Event.defineStatic('getThingEmailIds', function(thingId) {
    return this.getAll(thingId, {index: 'thingId'}).orderBy('createdAt').pluck({payload: {emailId: true}}).execute()
        .then(events => events.map(event => event.payload.emailId))
})

export default Event
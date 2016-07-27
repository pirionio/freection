const ResourceUtil = require('../util/resource-util')
const EventTypes = require('../../common/enums/event-types')

function createNewThing(thing) {
    return ResourceUtil.post('/api/new', thing)
}

function createComment(thingId, commentText) {
    return ResourceUtil.post(`/api/things/${thingId}/comments`, {commentText})
}

function doThing(thingId) {
    return ResourceUtil.post(`/api/things/${thingId}/do`)
}

function dismissThing(thingId) {
    return ResourceUtil.post(`/api/things/${thingId}/dismiss`)
}

function pingThing(thingId) {
    return ResourceUtil.post(`/api/things/${thingId}/ping`)
}

function closeThing(thingId) {
    return ResourceUtil.post(`/api/things/${thingId}/close`)
}

function markThingAsDone(thing) {
    return ResourceUtil.post(`/api/things/${thing.id}/done`)
}

function discardComments(notification) {
    return ResourceUtil.post(`/api/things/${notification.thing.id}/discard/${EventTypes.COMMENT.key}`)
}

function discardPing(notification) {
    return ResourceUtil.post(`/api/events/${notification.id}/discard`)
}

function markCommentAsRead(comment) {
    return ResourceUtil.post(`/api/things/${comment.id}/markcommentasread`)
}

module.exports = {createNewThing, doThing, dismissThing, markThingAsDone, closeThing,
    pingThing, createComment, discardComments, discardPing, markCommentAsRead}
const ResourceUtil = require('../util/resource-util')
const EventTypes = require('../../common/enums/event-types')

function doThing(thingId) {
    return ResourceUtil.post(`/api/things/${thingId}/do`)
}

function dismissThing(thingId) {
    return ResourceUtil.post(`/api/things/${thingId}/dismiss`)
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

module.exports = {doThing, dismissThing, markThingAsDone, closeThing,
    discardComments, discardPing, markCommentAsRead}

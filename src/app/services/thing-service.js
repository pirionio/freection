const ResourceUtil = require('../util/resource-util')

function createNewThing(thing) {
    return ResourceUtil.post('/api/new', thing)
}

function createComment(thingId, commentText) {
    return ResourceUtil.post(`/api/things/${thingId}/comments`, {commentText})
}

function doThing(thingId, eventId) {
    return ResourceUtil.post('/api/things/do', {
        thingId,
        eventId
    })
}

function closeThing(thingId, eventId) {
    return ResourceUtil.post('/api/things/close', {
        thingId,
        eventId
    })
}

function markThingAsDone(thing) {
    return ResourceUtil.post(`/api/things/${thing.id}/done`)
}

function dismissComments(notification) {
    return ResourceUtil.post(`/api/things/${notification.thing.id}/dismisscomments`)
}

function markCommentAsRead(comment) {
    return ResourceUtil.post(`/api/things/${comment.id}/markcommentasread`)
}

module.exports = {createNewThing, doThing, markThingAsDone, closeThing,
    createComment, dismissComments, markCommentAsRead}
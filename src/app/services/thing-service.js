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

function completeThing(thing) {
    return ResourceUtil.post('/api/things/done', {
        thingId: thing.id
    })
}

module.exports = {createNewThing, doThing, completeThing, createComment}
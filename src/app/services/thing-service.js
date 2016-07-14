const ResourceUtil = require('../util/resource-util')

function createNewThing(thing) {
    return ResourceUtil.post('/api/new', thing)
}

function doThing(thing) {
    return ResourceUtil.post('/api/things/do', {
        thingId: thing.thingId,
        eventId: thing.eventId
    })
}

function completeThing(thing) {
    return ResourceUtil.post('/api/things/done', {
        thingId: thing.id
    })
}

module.exports = {createNewThing, doThing, completeThing}
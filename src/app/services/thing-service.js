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

module.exports = {createNewThing, doThing}
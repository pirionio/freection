const ThingActionTypes = require('./types/thing-action-types')
const ThingService = require('../services/thing-service')
const {ActionStatus} = require('../constants')

function pingThingRequest(thing) {
    return {
        type: ThingActionTypes.PING_THING,
        status: ActionStatus.START,
        thing
    }
}

function pingThingCompleted(thing, pingEvent) {
    return {
        type: ThingActionTypes.PING_THING,
        status: ActionStatus.COMPLETE,
        thing,
        pingEvent
    }
}

function pingThingFailed(thing) {
    return {
        type: ThingActionTypes.PING_THING,
        status: ActionStatus.ERROR,
        thing
    }
}

const pingThing = (thing) => {
    return dispatch => {
        dispatch(pingThingRequest(thing))
        ThingService.pingThing(thing.id).
            then(pingEvent => dispatch(pingThingCompleted(thing, pingEvent))).
            catch(() => dispatch(pingThingFailed(thing))
        )
    }
}

module.exports = {pingThing}

const WhatsNewActionTypes = require('./types/whats-new-action-types')
const ThingService = require('../services/thing-service')
const {ActionStatus} = require('../constants')

function closeThingRequest(thing) {
    return {
        type: WhatsNewActionTypes.CLOSE_THING,
        status: ActionStatus.START,
        thing
    }
}

function closeThingComplete(thing) {
    return {
        type: WhatsNewActionTypes.CLOSE_THING,
        status: ActionStatus.COMPLETE,
        thing
    }
}

function closeThingFailed(thing) {
    return {
        type: WhatsNewActionTypes.CLOSE_THING,
        status: ActionStatus.ERROR,
        thing
    }
}

const closeThing = (thing) => {
    return dispatch => {
        dispatch(closeThingRequest(thing))
        ThingService.closeThing(thing.id).
            then(() => dispatch(closeThingComplete(thing))).
            catch(() => dispatch(closeThingFailed(thing))
        )
    }
}

module.exports = {closeThing}
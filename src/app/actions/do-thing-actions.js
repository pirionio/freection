const WhatsNewActionTypes = require('./types/whats-new-action-types')
const ThingService = require('../services/thing-service')
const {ActionStatus} = require('../constants')

function doThingRequest(thing) {
    return {
        type: WhatsNewActionTypes.DO_THING,
        status: ActionStatus.START,
        thing
    }
}

function doThingComplete(thing) {
    return {
        type: WhatsNewActionTypes.DO_THING,
        status: ActionStatus.COMPLETE,
        thing
    }
}

function doThingFailed(thing) {
    return {
        type: WhatsNewActionTypes.DO_THING,
        status: ActionStatus.ERROR,
        thing
    }
}

const doThing = (thing) => {
    return dispatch => {
        dispatch(doThingRequest(thing))
        ThingService.doThing(thing).
            then(() => dispatch(doThingComplete(thing))).
            catch(() => dispatch(doThingFailed(thing))
        )
    }
}

module.exports = {doThing}
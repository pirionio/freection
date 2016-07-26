const WhatsNewActionTypes = require('./types/whats-new-action-types')
const ThingService = require('../services/thing-service')
const {ActionStatus} = require('../constants')

function dismissThingRequest(thing) {
    return {
        type: WhatsNewActionTypes.DISMISS_THING,
        status: ActionStatus.START,
        thing
    }
}

function dismissThingComplete(thing) {
    return {
        type: WhatsNewActionTypes.DISMISS_THING,
        status: ActionStatus.COMPLETE,
        thing
    }
}

function dismissThingFailed(thing) {
    return {
        type: WhatsNewActionTypes.DISMISS_THING,
        status: ActionStatus.ERROR,
        thing
    }
}

const dismissThing = (thing) => {
    return dispatch => {
        dispatch(dismissThingRequest(thing))
        ThingService.dismissThing(thing.id).
            then(() => dispatch(dismissThingComplete(thing))).
            catch(() => dispatch(dismissThingFailed(thing))
        )
    }
}

module.exports = {dismissThing}
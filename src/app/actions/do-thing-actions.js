const WhatsNewActionTypes = require('./types/whats-new-action-types')
const ThingService = require('../services/thing-service')
const {ActionStatus} = require('../constants')

function doThingRequest(notification) {
    return {
        type: WhatsNewActionTypes.DO_THING,
        status: ActionStatus.START,
        notification
    }
}

function doThingComplete(notification) {
    return {
        type: WhatsNewActionTypes.DO_THING,
        status: ActionStatus.COMPLETE,
        notification
    }
}

function doThingFailed(notification) {
    return {
        type: WhatsNewActionTypes.DO_THING,
        status: ActionStatus.ERROR,
        notification
    }
}

const doThing = (notification) => {
    return dispatch => {
        dispatch(doThingRequest(notification))
        ThingService.doThing(notification).
            then(() => dispatch(doThingComplete(notification))).
            catch(() => dispatch(doThingFailed(notification))
        )
    }
}

module.exports = {doThing}
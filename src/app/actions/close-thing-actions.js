const WhatsNewActionTypes = require('./types/whats-new-action-types')
const ThingService = require('../services/thing-service')
const {ActionStatus} = require('../constants')

function closeThingRequest(notification) {
    return {
        type: WhatsNewActionTypes.CLOSE_THING,
        status: ActionStatus.START,
        notification
    }
}

function closeThingComplete(notification) {
    return {
        type: WhatsNewActionTypes.CLOSE_THING,
        status: ActionStatus.COMPLETE,
        notification
    }
}

function closeThingFailed(notification) {
    return {
        type: WhatsNewActionTypes.CLOSE_THING,
        status: ActionStatus.ERROR,
        notification
    }
}

const closeThing = (notification) => {
    return dispatch => {
        dispatch(closeThingRequest(notification))
        ThingService.closeThing(notification.thing.id, notification.id).
            then(() => dispatch(closeThingComplete(notification))).
            catch(() => dispatch(closeThingFailed(notification))
        )
    }
}

module.exports = {closeThing}
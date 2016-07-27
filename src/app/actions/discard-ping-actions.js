const WhatsNewActionTypes = require('./types/whats-new-action-types')
const ThingService = require('../services/thing-service')
const {ActionStatus} = require('../constants')

function discardPingRequest(notification, user) {
    return {
        type: WhatsNewActionTypes.DISCARD_PING,
        status: ActionStatus.START,
        notification,
        user
    }
}

function discardPingComplete(notification) {
    return {
        type: WhatsNewActionTypes.DISCARD_PING,
        status: ActionStatus.COMPLETE,
        notification
    }
}

function discardPingFailed(notification) {
    return {
        type: WhatsNewActionTypes.DISCARD_PING,
        status: ActionStatus.ERROR,
        notification
    }
}

const discardPing = (notification, user) => {
    return dispatch => {
        dispatch(discardPingRequest(notification, user))
        ThingService.discardPing(notification).
            then(() => dispatch(discardPingComplete(notification))).
            catch(() => dispatch(discardPingFailed(notification))
        )
    }
}

module.exports = {discardPing}
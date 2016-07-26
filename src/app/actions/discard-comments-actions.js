const WhatsNewActionTypes = require('./types/whats-new-action-types')
const ThingService = require('../services/thing-service')
const {ActionStatus} = require('../constants')

function discardCommentsRequest(notification, user) {
    return {
        type: WhatsNewActionTypes.DISCARD_COMMENTS,
        status: ActionStatus.START,
        notification,
        user
    }
}

function discardCommentsRequestComplete(notification) {
    return {
        type: WhatsNewActionTypes.DISCARD_COMMENTS,
        status: ActionStatus.COMPLETE,
        notification
    }
}

function discardCommentsRequestFailed(notification) {
    return {
        type: WhatsNewActionTypes.DISCARD_COMMENTS,
        status: ActionStatus.ERROR,
        notification
    }
}

const discardComments = (notification, user) => {
    return dispatch => {
        dispatch(discardCommentsRequest(notification, user))
        ThingService.discardComments(notification).
            then(() => dispatch(discardCommentsRequestComplete(notification))).
            catch(() => dispatch(discardCommentsRequestFailed(notification))
        )
    }
}

module.exports = {discardComments}
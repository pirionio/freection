const WhatsNewActionTypes = require('./types/whats-new-action-types')
const ThingService = require('../services/thing-service')
const {ActionStatus} = require('../constants')

function dismissCommentsRequest(notification, user) {
    return {
        type: WhatsNewActionTypes.DISMISS_COMMENTS,
        status: ActionStatus.START,
        notification,
        user
    }
}

function dismissCommentsRequestComplete(notification) {
    return {
        type: WhatsNewActionTypes.DISMISS_COMMENTS,
        status: ActionStatus.COMPLETE,
        notification
    }
}

function dismissCommentsRequestFailed(notification) {
    return {
        type: WhatsNewActionTypes.DISMISS_COMMENTS,
        status: ActionStatus.ERROR,
        notification
    }
}

const dismissComments = (notification, user) => {
    return dispatch => {
        dispatch(dismissCommentsRequest(notification, user))
        ThingService.dismissComments(notification).
            then(() => dispatch(dismissCommentsRequestComplete(notification))).
            catch(() => dispatch(dismissCommentsRequestFailed(notification))
        )
    }
}

module.exports = {dismissComments}
const WhatsNewActionTypes = require('./types/whats-new-action-types')
const WhatsNewService = require('../services/whats-new-service')
const {ActionStatus} = require('../constants')

function requestWhatsNew() {
    return {
        type: WhatsNewActionTypes.FETCH_WHATS_NEW,
        status: ActionStatus.START
    }
}

function requestWhatsNewCompelte(notifications) {
    return {
        type: WhatsNewActionTypes.FETCH_WHATS_NEW,
        status: ActionStatus.COMPLETE,
        notifications
    }
}

function requestWhatsNewFailed() {
    return {
        type: WhatsNewActionTypes.FETCH_WHATS_NEW,
        status: ActionStatus.ERROR
    }
}

function notificationReceivedAction(notification) {
    return {
        type: WhatsNewActionTypes.NOTIFICATION_RECEIVED,
        notification
    }
}

const fetchWhatsNew = () => {
    return dispatch => {
        dispatch(requestWhatsNew())
        WhatsNewService.getNotifications().
            then(notifications => dispatch(requestWhatsNewCompelte(notifications))).
            catch(() => dispatch(requestWhatsNewFailed())
        )
    }
}

const notificationReceived = (notification) => {
    return dispatch => {
        dispatch(notificationReceivedAction(notification))
    }
}

module.exports = {fetchWhatsNew, notificationReceived}
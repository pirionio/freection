const WhatsNewActionTypes = require('./types/whats-new-action-types')
const WhatsNewService = require('../services/whats-new-service')
const {ActionStatus, InvalidationStatus} = require('../constants')

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

const fetchWhatsNew = () => {
    return (dispatch, getState) => {
        const {whatsNew} = getState()
        if (whatsNew.invalidationStatus === InvalidationStatus.INVALIDATED) {
            dispatch(requestWhatsNew())
            WhatsNewService.getNotifications().
                then(notifications => dispatch(requestWhatsNewCompelte(notifications))).
                catch(() => dispatch(requestWhatsNewFailed())
            )
        }
    }
}

const notificationReceived = (notification) => {
    return {
        type: WhatsNewActionTypes.NOTIFICATION_RECEIVED,
        notification
    }
}

const notificationDeleted = (notification) => {
    return {
        type: WhatsNewActionTypes.NOTIFICATION_DELETED,
        notification
    }
}

module.exports = {fetchWhatsNew, notificationReceived, notificationDeleted}
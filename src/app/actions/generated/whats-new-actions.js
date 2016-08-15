const WhatsNewActionsTypes = require('../types/whats-new-action-types')
const {ActionStatus} = require('../../constants')
const ResourceUtil = require('../../util/resource-util')

function setState(notifications) {
    return {
        type: WhatsNewActionsTypes.SET_STATE,
        notifications
    }
}

function fetchWhatsNew() {
    return dispatch => {
        dispatch({
            type: WhatsNewActionsTypes.FETCH_WHATS_NEW, 
            status: ActionStatus.START            
        })
        return ResourceUtil.get(`/api/things/whatsnew`)
            .then(result => dispatch({
                type: WhatsNewActionsTypes.FETCH_WHATS_NEW, 
                status: ActionStatus.COMPLETE,
                notifications: result
            }))
            .catch(() => dispatch({
                type: WhatsNewActionsTypes.FETCH_WHATS_NEW, 
                status: ActionStatus.ERROR                
            }))
    }
}

function notificationReceived(notification) {
    return {
        type: WhatsNewActionsTypes.NOTIFICATION_RECEIVED,
        notification
    }
}

function notificationDeleted(notification) {
    return {
        type: WhatsNewActionsTypes.NOTIFICATION_DELETED,
        notification
    }
}

module.exports = {
    setState,
    fetchWhatsNew,
    notificationReceived,
    notificationDeleted
}
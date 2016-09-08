import WhatsNewActionsTypes from '../types/whats-new-action-types'
import {ActionStatus} from '../../constants'
import * as ResourceUtil from '../../util/resource-util'

export function setState(notifications) {
    return {
        type: WhatsNewActionsTypes.SET_STATE,
        notifications
    }
}

export function _fetchWhatsNew() {
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

export function notificationReceived(notification) {
    return {
        type: WhatsNewActionsTypes.NOTIFICATION_RECEIVED,
        notification
    }
}

export function notificationDeleted(notification) {
    return {
        type: WhatsNewActionsTypes.NOTIFICATION_DELETED,
        notification
    }
}

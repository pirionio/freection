import EmailActionsTypes from '../types/email-action-types'
import {ActionStatus} from '../../constants'
import * as ResourceUtil from '../../util/resource-util'

export function _fetchUnread() {
    return dispatch => {
        dispatch({
            type: EmailActionsTypes.FETCH_UNREAD, 
            status: ActionStatus.START            
        })
        return ResourceUtil.get(`/emails/api/unread`)
            .then(result => dispatch({
                type: EmailActionsTypes.FETCH_UNREAD, 
                status: ActionStatus.COMPLETE,
                emails: result
            }))
            .catch(() => dispatch({
                type: EmailActionsTypes.FETCH_UNREAD, 
                status: ActionStatus.ERROR                
            }))
    }
}

export function updateUnread() {
    return dispatch => {
        dispatch({
            type: EmailActionsTypes.UPDATE_UNREAD, 
            status: ActionStatus.START            
        })
        return ResourceUtil.get(`/emails/api/unread`)
            .then(result => dispatch({
                type: EmailActionsTypes.UPDATE_UNREAD, 
                status: ActionStatus.COMPLETE,
                emails: result
            }))
            .catch(() => dispatch({
                type: EmailActionsTypes.UPDATE_UNREAD, 
                status: ActionStatus.ERROR                
            }))
    }
}

export function hello() {
    return dispatch => {
        dispatch({
            type: EmailActionsTypes.HELLO, 
            status: ActionStatus.START            
        })
        return ResourceUtil.post(`/emails/push/hello`)
            .then(result => dispatch({
                type: EmailActionsTypes.HELLO, 
                status: ActionStatus.COMPLETE                
            }))
            .catch(() => dispatch({
                type: EmailActionsTypes.HELLO, 
                status: ActionStatus.ERROR                
            }))
    }
}

export function invalidate() {
    return {
        type: EmailActionsTypes.INVALIDATE        
    }
}

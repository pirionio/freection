import EmailPageActionsTypes from '../types/email-page-action-types'
import {ActionStatus} from '../../constants'
import * as ResourceUtil from '../../util/resource-util'

export function _showEmailPage(emailThread) {
    return {
        type: EmailPageActionsTypes.SHOW_EMAIL_PAGE,
        emailThread
    }
}

export function _hideEmailPage() {
    return {
        type: EmailPageActionsTypes.HIDE_EMAIL_PAGE        
    }
}

export function requireUpdate() {
    return {
        type: EmailPageActionsTypes.REQUIRE_UPDATE        
    }
}

export function _getEmail(emailThreadId) {
    return dispatch => {
        dispatch({
            type: EmailPageActionsTypes.GET_EMAIL, 
            status: ActionStatus.START,
            emailThreadId
        })
        return ResourceUtil.get(`/emails/api/${emailThreadId}`)
            .then(result => dispatch({
                type: EmailPageActionsTypes.GET_EMAIL, 
                status: ActionStatus.COMPLETE,
                thread: result
            }))
            .catch(() => dispatch({
                type: EmailPageActionsTypes.GET_EMAIL, 
                status: ActionStatus.ERROR,
                emailThreadId
            }))
    }
}

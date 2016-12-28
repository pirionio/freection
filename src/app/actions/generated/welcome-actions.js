import WelcomeActionsTypes from '../types/welcome-action-types'
import {ActionStatus} from '../../constants'
import * as ResourceUtil from '../../util/resource-util'

export function setWelcomeStatus(welcomeStatus) {
    return dispatch => {
        dispatch({
            type: WelcomeActionsTypes.SET_WELCOME_STATUS, 
            status: ActionStatus.START,
            welcomeStatus
        })
        return ResourceUtil.post(`/api/users/welcome/status`, {
                welcomeStatus: welcomeStatus
            })
            .then(result => dispatch({
                type: WelcomeActionsTypes.SET_WELCOME_STATUS, 
                status: ActionStatus.COMPLETE,
                user: result
            }))
            .catch(() => dispatch({
                type: WelcomeActionsTypes.SET_WELCOME_STATUS, 
                status: ActionStatus.ERROR,
                welcomeStatus
            }))
    }
}

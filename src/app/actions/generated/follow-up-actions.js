import FollowUpActionsTypes from '../types/follow-up-action-types'
import {ActionStatus} from '../../constants'
import ResourceUtil from '../../util/resource-util'

export function setState(followUps) {
    return {
        type: FollowUpActionsTypes.SET_STATE,
        followUps
    }
}

export function _fetchFollowUps() {
    return dispatch => {
        dispatch({
            type: FollowUpActionsTypes.FETCH_FOLLOW_UPS, 
            status: ActionStatus.START            
        })
        return ResourceUtil.get(`/api/things/followups`)
            .then(result => dispatch({
                type: FollowUpActionsTypes.FETCH_FOLLOW_UPS, 
                status: ActionStatus.COMPLETE,
                followUps: result
            }))
            .catch(() => dispatch({
                type: FollowUpActionsTypes.FETCH_FOLLOW_UPS, 
                status: ActionStatus.ERROR                
            }))
    }
}

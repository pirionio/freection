import AllThingsActionsTypes from '../types/all-things-action-types'
import {ActionStatus} from '../../constants'
import * as ResourceUtil from '../../util/resource-util'

export function setState(followUps) {
    return {
        type: AllThingsActionsTypes.SET_STATE,
        followUps
    }
}

export function _fetchAllThings() {
    return dispatch => {
        dispatch({
            type: AllThingsActionsTypes.FETCH_ALL_THINGS, 
            status: ActionStatus.START            
        })
        return ResourceUtil.get(`/api/things/all`)
            .then(result => dispatch({
                type: AllThingsActionsTypes.FETCH_ALL_THINGS, 
                status: ActionStatus.COMPLETE,
                things: result
            }))
            .catch(() => dispatch({
                type: AllThingsActionsTypes.FETCH_ALL_THINGS, 
                status: ActionStatus.ERROR                
            }))
    }
}

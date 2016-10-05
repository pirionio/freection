import ToActionsTypes from '../types/to-action-types'
import {ActionStatus} from '../../constants'
import * as ResourceUtil from '../../util/resource-util'

export function get(query) {
    return dispatch => {
        dispatch({
            type: ToActionsTypes.GET, 
            status: ActionStatus.START,
            query
        })
        return ResourceUtil.get(`/api/contacts?query=${query}&max=6`)
            .then(result => dispatch({
                type: ToActionsTypes.GET, 
                status: ActionStatus.COMPLETE,
                contacts: result,
                query: query
            }))
            .catch(() => dispatch({
                type: ToActionsTypes.GET, 
                status: ActionStatus.ERROR,
                query
            }))
    }
}

export function clear() {
    return {
        type: ToActionsTypes.CLEAR        
    }
}

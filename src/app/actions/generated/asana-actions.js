import AsanaActionsTypes from '../types/asana-action-types'
import {ActionStatus} from '../../constants'
import * as ResourceUtil from '../../util/resource-util'

export function fetchAsana() {
    return dispatch => {
        dispatch({
            type: AsanaActionsTypes.FETCH_ASANA, 
            status: ActionStatus.START            
        })
        return ResourceUtil.get(`/api/asana`)
            .then(result => dispatch({
                type: AsanaActionsTypes.FETCH_ASANA, 
                status: ActionStatus.COMPLETE,
                asana: result
            }))
            .catch(() => dispatch({
                type: AsanaActionsTypes.FETCH_ASANA, 
                status: ActionStatus.ERROR                
            }))
    }
}

export function enableProject(id) {
    return dispatch => {
        dispatch({
            type: AsanaActionsTypes.ENABLE_PROJECT, 
            status: ActionStatus.START,
            id
        })
        return ResourceUtil.post(`/api/asana/enableproject/${id}`)
            .then(result => dispatch({
                type: AsanaActionsTypes.ENABLE_PROJECT, 
                status: ActionStatus.COMPLETE,
                id
            }))
            .catch(() => dispatch({
                type: AsanaActionsTypes.ENABLE_PROJECT, 
                status: ActionStatus.ERROR,
                id
            }))
    }
}

export function disableProject(id) {
    return dispatch => {
        dispatch({
            type: AsanaActionsTypes.DISABLE_PROJECT, 
            status: ActionStatus.START,
            id
        })
        return ResourceUtil.post(`/api/asana/disableproject/${id}`)
            .then(result => dispatch({
                type: AsanaActionsTypes.DISABLE_PROJECT, 
                status: ActionStatus.COMPLETE,
                id
            }))
            .catch(() => dispatch({
                type: AsanaActionsTypes.DISABLE_PROJECT, 
                status: ActionStatus.ERROR,
                id
            }))
    }
}

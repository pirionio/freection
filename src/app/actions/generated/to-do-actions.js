import ToDoActionsTypes from '../types/to-do-action-types'
import {ActionStatus} from '../../constants'
import * as ResourceUtil from '../../util/resource-util'

export function setState(things) {
    return {
        type: ToDoActionsTypes.SET_STATE,
        things
    }
}

export function _fetchToDo() {
    return dispatch => {
        dispatch({
            type: ToDoActionsTypes.FETCH_TO_DO, 
            status: ActionStatus.START            
        })
        return ResourceUtil.get(`/api/things/do`)
            .then(result => dispatch({
                type: ToDoActionsTypes.FETCH_TO_DO, 
                status: ActionStatus.COMPLETE,
                things: result
            }))
            .catch(() => dispatch({
                type: ToDoActionsTypes.FETCH_TO_DO, 
                status: ActionStatus.ERROR                
            }))
    }
}

export function reorderDrag(movedItemId,onItemId) {
    return {
        type: ToDoActionsTypes.REORDER_DRAG,
        movedItemId,
        onItemId
    }
}

export function moveToGroup(movedItemId,category) {
    return {
        type: ToDoActionsTypes.MOVE_TO_GROUP,
        movedItemId,
        category
    }
}

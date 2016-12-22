import TrelloActionsTypes from '../types/trello-action-types'
import {ActionStatus} from '../../constants'
import * as ResourceUtil from '../../util/resource-util'

export function fetchUserInfo() {
    return dispatch => {
        dispatch({
            type: TrelloActionsTypes.FETCH_USER_INFO, 
            status: ActionStatus.START            
        })
        return ResourceUtil.get(`/api/trello`)
            .then(result => dispatch({
                type: TrelloActionsTypes.FETCH_USER_INFO, 
                status: ActionStatus.COMPLETE,
                trello: result
            }))
            .catch(() => dispatch({
                type: TrelloActionsTypes.FETCH_USER_INFO, 
                status: ActionStatus.ERROR                
            }))
    }
}

export function enableBoard(boardId) {
    return dispatch => {
        dispatch({
            type: TrelloActionsTypes.ENABLE_BOARD, 
            status: ActionStatus.START,
            boardId
        })
        return ResourceUtil.post(`/api/trello/enableboard/${boardId}`)
            .then(result => dispatch({
                type: TrelloActionsTypes.ENABLE_BOARD, 
                status: ActionStatus.COMPLETE,
                boardId
            }))
            .catch(() => dispatch({
                type: TrelloActionsTypes.ENABLE_BOARD, 
                status: ActionStatus.ERROR,
                boardId
            }))
    }
}

export function disableBoard(boardId) {
    return dispatch => {
        dispatch({
            type: TrelloActionsTypes.DISABLE_BOARD, 
            status: ActionStatus.START,
            boardId
        })
        return ResourceUtil.post(`/api/trello/disableboard/${boardId}`)
            .then(result => dispatch({
                type: TrelloActionsTypes.DISABLE_BOARD, 
                status: ActionStatus.COMPLETE,
                boardId
            }))
            .catch(() => dispatch({
                type: TrelloActionsTypes.DISABLE_BOARD, 
                status: ActionStatus.ERROR,
                boardId
            }))
    }
}

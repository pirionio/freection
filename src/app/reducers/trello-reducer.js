import TrelloActionTypes from '../actions/types/trello-action-types'
import {ActionStatus, InvalidationStatus} from '../constants'
import immutable from '../util/immutable'

const initialState = {
    active: false,
    boards: [],
    invalidationStatus: InvalidationStatus.INVALIDATED
}

function fetchUserInfo(state, action) {
    switch (action.status) {
        case ActionStatus.COMPLETE:
            return immutable(action)
                .set('active', action.trello.active)
                .set('boards', action.trello.boards ? action.trello.boards: [])
                .set('invalidationStatus', InvalidationStatus.FETCHED)
                .value()
        case ActionStatus.START:
            return immutable(state)
                .set('invalidationStatus', InvalidationStatus.FETCHING)
                .value()
        case ActionStatus.ERROR:
            return immutable(state)
                .set('invalidationStatus', InvalidationStatus.INVALIDATED)
                .value()
        default:
            return status
    }
}

function enableBoard(state, action) {
    switch (action.status) {
        case ActionStatus.COMPLETE:
            return immutable(state)
                .arrayMergeItem('boards', {id: action.boardId}, {enabled: true, posting: false})
                .value()
        case ActionStatus.START:
            return immutable(state)
                .arrayMergeItem('boards', {id: action.boardId}, {posting: true})
                .value()
        default:
            return state
    }
}

function disableBoard(state, action) {
    switch (action.status) {
        case ActionStatus.COMPLETE:
            return immutable(state)
                .arrayMergeItem('boards', {id: action.boardId}, {enabled: false, posting: false})
                .value()
        case ActionStatus.START:
            return immutable(state)
                .arrayMergeItem('boards', {id: action.boardId}, {posting: true})
                .value()
        default:
            return state
    }
}

export default function(state = initialState, action) {
    switch (action.type){
        case TrelloActionTypes.FETCH_USER_INFO:
            return fetchUserInfo(state, action)
        case TrelloActionTypes.ENABLE_BOARD:
            return enableBoard(state, action)
        case TrelloActionTypes.DISABLE_BOARD:
            return disableBoard(state, action)
        default:
            return state
    }
}

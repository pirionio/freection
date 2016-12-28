import AsanaActionTypes from '../actions/types/asana-action-types'
import {ActionStatus, InvalidationStatus} from '../constants'
import immutable from '../util/immutable'

const initialState = {
    active: false,
    projects: [],
    invalidationStatus: InvalidationStatus.INVALIDATED
}

function fetchAsana(state, action) {
    switch (action.status) {
        case ActionStatus.COMPLETE:
            return immutable(action)
                .set('active', action.asana.active)
                .set('projects', action.asana.projects ? action.asana.projects : [])
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

function enableProject(state, action) {
    switch (action.status) {
        case ActionStatus.COMPLETE:
            return immutable(state)
                .arrayMergeItem('projects', {id: action.id}, {enabled: true, posting: false})
                .value()
        case ActionStatus.START:
            return immutable(state)
                .arrayMergeItem('projects', {id: action.id}, {posting: true})
                .value()
        case ActionStatus.ERROR:
            return immutable(state)
                .arrayMergeItem('projects', {id: action.id}, {enabled: true, posting: false})
                .value()
        default:
            return state
    }
}

function disableProject(state, action) {
    switch (action.status) {
        case ActionStatus.COMPLETE:
            return immutable(state)
                .arrayMergeItem('projects', {id: action.id}, {enabled: false, posting: false})
                .value()
        case ActionStatus.START:
            return immutable(state)
                .arrayMergeItem('projects', {id: action.id}, {posting: true})
                .value()
        case ActionStatus.ERROR:
            return immutable(state)
                .arrayMergeItem('projects', {id: action.id}, {enabled: false, posting: false})
                .value()
        default:
            return state
    }
}

export default function(state = initialState, action) {
    switch (action.type){
        case AsanaActionTypes.FETCH_ASANA:
            return fetchAsana(state, action)
        case AsanaActionTypes.ENABLE_PROJECT:
            return enableProject(state, action)
        case AsanaActionTypes.DISABLE_PROJECT:
            return disableProject(state, action)
        default:
            return state
    }
}

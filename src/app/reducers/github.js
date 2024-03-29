import GithubActionTypes from '../actions/types/github-action-types'
import {ActionStatus, InvalidationStatus} from '../constants'
import immutable from '../util/immutable'

const initialState = {
    active: false,
    repositories: [],
    invalidationStatus: InvalidationStatus.INVALIDATED
}

function fetchGithub(state, action) {
    switch (action.status) {
        case ActionStatus.COMPLETE:
            return immutable(action)
                .set('active', action.github.active)
                .set('repositories', action.github.repositories ? action.github.repositories : [])
                .set('clientID', action.github.clientID)
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

function enableRepository(state, action) {
    switch (action.status) {
        case ActionStatus.COMPLETE:
            return immutable(state)
                .arrayMergeItem('repositories', {fullName: action.fullName}, {enabled: true, posting: false})
                .value()
        case ActionStatus.START:
            return immutable(state)
                .arrayMergeItem('repositories', {fullName: action.fullName}, {posting: true})
                .value()
        default:
            return state
    }
}

function disableRepository(state, action) {
    switch (action.status) {
        case ActionStatus.COMPLETE:
            return immutable(state)
                .arrayMergeItem('repositories', {fullName: action.fullName}, {enabled: false, posting: false})
                .value()
        case ActionStatus.START:
            return immutable(state)
                .arrayMergeItem('repositories', {fullName: action.fullName}, {posting: true})
                .value()
        default:
            return state
    }
}

export default function(state = initialState, action) {
    switch (action.type){
        case GithubActionTypes.FETCH_GITHUB:
            return fetchGithub(state, action)
        case GithubActionTypes.ENABLE_REPOSITORY:
            return enableRepository(state, action)
        case GithubActionTypes.DISABLE_REPOSITORY:
            return disableRepository(state, action)
        default:
            return state
    }
}

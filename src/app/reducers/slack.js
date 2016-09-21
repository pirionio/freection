import SlackActionTypes from '../actions/types/slack-action-types'
import {ActionStatus, InvalidationStatus} from '../constants'
import immutable from '../util/immutable'

const initialState = {
    active: false,
    repositories: [],
    invalidationStatus: InvalidationStatus.INVALIDATED
}

function fetch(state, action) {
    switch (action.status) {
        case ActionStatus.COMPLETE:
            return immutable(action)
                .set('active', action.slack.active)
                .set('appInstalled', action.slack.appInstalled)
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

export default function(state = initialState, action) {
    switch (action.type){
        case SlackActionTypes.FETCH:
            return fetch(state, action)
        default:
            return state
    }
}

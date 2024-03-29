import some from 'lodash/some'

import AllThingsActionTypes from '../actions/types/all-things-action-types'
import {isOfTypeEvent} from '../actions/types/event-action-types'
import SystemEventActionTypes from '../actions/types/system-event-action-types'
import {ActionStatus, InvalidationStatus} from '../constants'
import thingReducer from './thing-reducer'
import immutable from '../util/immutable'

const initialState = {
    things: [],
    invalidationStatus: InvalidationStatus.INVALIDATED
}

function setState(state, action) {
    return {
        things: action.things,
        invalidationStatus: InvalidationStatus.FETCHED
    }
}

function reconnected(state) {
    if (state.invalidationStatus === InvalidationStatus.FETCHED) {
        return immutable(state)
            .set('invalidationStatus', InvalidationStatus.REQUIRE_UPDATE)
            .value()
    }

    return state
}

function allThings(state, action) {
    switch (action.status) {
        case ActionStatus.COMPLETE:
            return setState(state, action)
        case ActionStatus.START:
            const status = state.invalidationStatus === InvalidationStatus.REQUIRE_UPDATE ?
                InvalidationStatus.UPDATING :
                InvalidationStatus.FETCHING

            return immutable(state)
                .set('invalidationStatus', status)
                .value()
        case ActionStatus.ERROR:
        default:
            return immutable(state)
                .set('invalidationStatus', InvalidationStatus.INVALIDATED)
                .value()
    }
}

function updateThing(state, action) {
    if (state.invalidationStatus !== InvalidationStatus.FETCHED)
        return state

    if (!action.event.thing.isInAll)
        return state

    if (!some(state.things, {id: action.event.thing.id})) {
        return immutable(state)
            .arrayPushItem('things', action.event.thing)
            .value()
    }

    return immutable(state)
        .arraySetOrPushItem('things', {id: action.event.thing.id}, item => thingReducer(item, action))
        .value()
}

export default (state = initialState, action) => {
    switch (action.type) {
        case AllThingsActionTypes.SET_STATE:
            return setState(state, action)
        case SystemEventActionTypes.RECONNECTED:
            return reconnected(state)
        case AllThingsActionTypes.FETCH_ALL_THINGS:
            return allThings(state, action)
        default:
            if (isOfTypeEvent(action.type))
                return updateThing(state, action)

            return state
    }
}
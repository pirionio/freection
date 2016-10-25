import some from 'lodash/some'
import merge from 'lodash/merge'

import ToDoActionTypes from '../actions/types/to-do-action-types'
import ThingCommandActionTypes from '../actions/types/thing-command-action-types'
import EventActionTypes, {isOfTypeEvent} from '../actions/types/event-action-types'
import SystemEventActionTypes from '../actions/types/system-event-action-types'
import {ActionStatus, InvalidationStatus} from '../constants'
import EventTypes from '../../common/enums/event-types'
import thingReducer from './thing-reducer'
import immutable from '../util/immutable'

const initialState = {
    things: [],
    invalidationStatus: InvalidationStatus.INVALIDATED
}

function setState(state, action) {
    return immutable(action)
        .arraySetAll('things', thing => {
            return immutable(thing)
                .arrayMergeItem('events', {eventType: {key: EventTypes.PING.key}}, {payload: {text: 'Ping!'}})
                .value()
        })
        .set('invalidationStatus', InvalidationStatus.FETCHED)
        .value()
}

function reconnected(state) {
    if (state.invalidationStatus === InvalidationStatus.FETCHED) {
        return immutable(state)
            .set('invalidationStatus', InvalidationStatus.REQUIRE_UPDATE)
            .value()
    }

    return state
}

function toDo(state, action) {
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

function actionDoneOnThing(state, action) {
    switch (action.status) {
        case ActionStatus.START:
            return immutable(state)
                .arrayReject('things', {id: action.thing.id})
                .value()
        case ActionStatus.ERROR:
            // If there was an error, since we already removed the thing from the state, we now want to re-add it.
            return immutable(state)
                .arrayPushItem('things', action.thing)
                .value()
        case ActionStatus.COMPLETE:
        default:
            return state
    }
}

function updateThing(state, action) {
    if (state.invalidationStatus !== InvalidationStatus.FETCHED)
        return state

    // If doer and not exist, lets add it
    if (action.event.thing.isDoer && !some(state.things, {id: action.event.thing.id})) {
        return immutable(state)
            .arrayPushItem('things', action.event.thing)
            .value()
    }

    return immutable(state)
        .arraySetItem('things', {id: action.event.thing.id}, item => thingReducer(item, action))
        .arrayReject('things', {isDoer: false})
        .value()
}

export default (state = initialState, action) => {
    switch (action.type) {
        case ToDoActionTypes.SET_STATE:
            return setState(state, action)
        case SystemEventActionTypes.RECONNECTED:
            return reconnected(state)
        case ToDoActionTypes.FETCH_TO_DO:
            return toDo(state, action)
        case ThingCommandActionTypes.MARK_AS_DONE:
        case ThingCommandActionTypes.DISMISS:
        case ThingCommandActionTypes.CLOSE_ACK:
            return actionDoneOnThing(state, action)
        default:
            if (isOfTypeEvent(action.type)) {
                return updateThing(state, action)
            }

            return state
    }
}

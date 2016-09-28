import MentionActionTypes from '../actions/types/mentions-action-types'
import EventActionTypes from '../actions/types/event-action-types'
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

function setMentions(state, action) {
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

function mentioned(state, action) {
    // TODO Handle FETCHING state by queuing incoming events
    if (state.invalidationStatus !== InvalidationStatus.FETCHED)
        return state

    if (!action.event.thing.isMentioned)
        return state

    return immutable(state)
        .arrayPushItem('things', action.event.thing)
        .value()
}

function messageReceived(state, action) {
    // TODO Handle FETCHING state by queuing incoming events
    if (state.invalidationStatus !== InvalidationStatus.FETCHED)
        return state

    return immutable(state)
        .arraySetItem('things', {id: action.event.thing.id}, item => thingReducer(item, action))
        .value()
}

export default (state = initialState, action) => {
    switch (action.type) {
        case MentionActionTypes.SET_STATE:
            return setState(state, action)
        case EventActionTypes.RECONNECTED:
            return reconnected(state)
        case MentionActionTypes.FETCH_MENTIONS:
            return setMentions(state, action)
        case EventActionTypes.MENTIONED:
            return mentioned(state, action)
        case EventActionTypes.COMMENT_CREATED:
        case EventActionTypes.COMMENT_READ_BY:
        case EventActionTypes.PINGED:
        case EventActionTypes.PONGED:
            return messageReceived(state, action)
        default:
            return state
    }
}

const some = require('lodash/some')
const merge = require('lodash/merge')

import FollowUpsActionTypes from '../actions/types/follow-up-action-types'
import EventActionTypes from '../actions/types/event-action-types'
import ThingCommandActionTypes from '../actions/types/thing-command-action-types'
const {ActionStatus, InvalidationStatus} = require('../constants')
const thingReducer = require('./thing-reducer')
import EventTypes from '../../common/enums/event-types'
const immutable = require('../util/immutable')

const initialState = {
    followUps: [],
    invalidationStatus: InvalidationStatus.INVALIDATED
}

function setState(state, action) {
    return immutable(action)
        .arraySetAll('followUps', thing => {
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

function fetchFollowUps(state, action) {
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

function pingThing(state, action) {
    switch (action.status) {
        case ActionStatus.COMPLETE:
            return immutable(state)
                .arraySetItem('followUps', {id: action.event.thing.id}, thing => thingReducer(thing, action))
                .value()
        case ActionStatus.START:
        case ActionStatus.ERROR:
        default:
            return state
    }
}

function commentChangedOrAdded(state, action) {
    return messageReceived(state, action)
}

function pongReceived(state, action) {
    return messageReceived(state, action)
}

function messageReceived(state, action) {
    // TODO Handle FETCHING state by queuing incoming events
    if (state.invalidationStatus !== InvalidationStatus.FETCHED)
        return state

    return immutable(state)
        .arraySetItem('followUps', {id: action.event.thing.id}, item => thingReducer(item, action))
        .value()
}

function created(state, action) {
    // let's add the event to the thing
    const thing = immutable(action.event.thing)
        .set('events', [action.event])
        .value()

    return statusChangedReceived(state, merge({}, action, {event: {thing}}))
}

function statusChangedReceived(state, action) {
    if (state.invalidationStatus !== InvalidationStatus.FETCHED)
        return state
 
    // If followup and not exist, lets add it
    if (action.event.thing.isFollowUper && !some(state.followUps, {id: action.event.thing.id})) {
        return immutable(state)
            .arrayPushItem('followUps', action.event.thing)
            .value()
    }

    return immutable(state)
        .arraySetItem('followUps', {id: action.event.thing.id}, item => thingReducer(item, action))
        .arrayReject('followUps', {isFollowUper: false})
        .value()
}

module.exports = (state = initialState, action) => {
    switch (action.type) {
        case FollowUpsActionTypes.SET_STATE:
            return setState(state, action)
        case EventActionTypes.RECONNECTED:
            return reconnected(state)
        case FollowUpsActionTypes.FETCH_FOLLOW_UPS:
            return fetchFollowUps(state, action)
        case EventActionTypes.COMMENT_CREATED:
        case EventActionTypes.COMMENT_READ_BY:
            return commentChangedOrAdded(state, action)
        case ThingCommandActionTypes.PING:
            return pingThing(state, action)
        case EventActionTypes.PONGED:
            return pongReceived(state, action)
        case EventActionTypes.CREATED:
            return created(state, action)
        case EventActionTypes.ACCEPTED:
        case EventActionTypes.MARKED_AS_DONE:
        case EventActionTypes.DISMISSED:
        case EventActionTypes.CLOSED:
        case EventActionTypes.CLOSE_ACKED:
        case EventActionTypes.SENT_BACK:
            return statusChangedReceived(state, action)
        default:
            return state
    }
}
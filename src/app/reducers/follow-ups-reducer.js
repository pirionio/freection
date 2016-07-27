const some = require('lodash/some')
const merge = require('lodash/merge')

const FollowUpsActionTypes = require('../actions/types/follow-up-action-types')
const ThingActionTypes = require('../actions/types/thing-action-types')
const ThingCommandActionTypes = require('../actions/types/thing-command-action-types')
const {ActionStatus, InvalidationStatus} = require('../constants')
const thingReducer = require('./thing-reducer')
const EventTypes = require('../../common/enums/event-types')
const immutable = require('../util/immutable')

const initialState = {
    followUps: [],
    invalidationStatus: InvalidationStatus.INVALIDATED
}

function fetchFollowUps(state, action) {
    switch (action.status) {
        case ActionStatus.COMPLETE:
            return immutable(action)
                .arraySetAll('followUps', thing => {
                    return immutable(thing)
                        .arrayMergeItem('events', {eventType: {key: EventTypes.PING.key}}, {payload: {text: 'Ping!'}})
                        .value()
                })
                .set('invalidationStatus', InvalidationStatus.FETCHED)
                .value()
        case ActionStatus.START:
            return immutable(state)
                .set('invalidationStatus', InvalidationStatus.FETCHING)
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
                .arraySetItem('followUps', {id: action.thing.id}, thing => thingReducer(thing, action))
                .value()
        case ActionStatus.START:
        case ActionStatus.ERROR:
        default:
            return state
    }
}

function createdReceived(state, action) {
    // TODO Handle FETCHING state by queuing incoming events
    if (state.invalidationStatus !== InvalidationStatus.FETCHED)
        return state

    if (!action.thing.isFollowUper)
        return state

    // already exist?
    if (some(state.followUps, {id: action.thing.id}))
        return state

    // Adding to array
    return immutable(state)
        .arrayPushItem('followUps', action.thing)
        .value()
}

function closedOrAbortedReceived(state, action) {
    // TODO Handle FETCHING state by queuing incoming events
    if (state.invalidationStatus !== InvalidationStatus.FETCHED)
        return state

    //  If I'm still a followUper for some reason, leave this
    if (action.thing.isFollowUper)
        return state

    return immutable(state)
        .arrayReject('followUps', {id: action.thing.id})
        .value()
}

function commentChangedOrAdded(state, action) {
    // TODO Handle FETCHING state by queuing incoming events
    if (state.invalidationStatus !== InvalidationStatus.FETCHED)
        return state

    return immutable(state)
        .arraySetItem('followUps', {id: action.comment.thing.id}, item => thingReducer(item, action))
        .value()
}

function statusChanged(state, action) {
    // TODO Handle FETCHING state by queuing incoming events
    if (state.invalidationStatus !== InvalidationStatus.FETCHED)
        return state

    return immutable(state)
        .arraySetItem('followUps', {id: action.thing.id}, item => thingReducer(item, action))
        .value()
}

module.exports = (state = initialState, action) => {
    switch (action.type) {
        case FollowUpsActionTypes.FETCH_FOLLOW_UPS:
            return fetchFollowUps(state, action)
        case ThingCommandActionTypes.PING:
            return pingThing(state, action)
        case ThingActionTypes.CREATED_RECEIVED:
            return createdReceived(state, action)
        case ThingActionTypes.CLOSED_RECEIVED:
        case ThingActionTypes.ABORTED_RECEIVED:
            return closedOrAbortedReceived(state, action)
        case ThingActionTypes.NEW_COMMENT_RECEIVED:
        case ThingActionTypes.COMMENT_READ_BY_RECEIVED:
            return commentChangedOrAdded(state, action)
        case ThingActionTypes.ACCEPTED_RECEIVED:
        case ThingActionTypes.DONE_RECEIVED:
        case ThingActionTypes.DISMISSED_RECEIVED:
            return statusChanged(state, action)
        default:
            return state
    }
}
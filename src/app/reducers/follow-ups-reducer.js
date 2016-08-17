const some = require('lodash/some')
const merge = require('lodash/merge')

const FollowUpsActionTypes = require('../actions/types/follow-up-action-types')
const EventActionTypes = require('../actions/types/event-action-types')
const ThingCommandActionTypes = require('../actions/types/thing-command-action-types')
const {ActionStatus, InvalidationStatus} = require('../constants')
const thingReducer = require('./thing-reducer')
const EventTypes = require('../../common/enums/event-types')
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

function fetchFollowUps(state, action) {
    switch (action.status) {
        case ActionStatus.COMPLETE:
            return setState(state, action)
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

function commentChangedOrAdded(state, action) {
    return messageReceived(state, action, 'comment')
}

function pongReceived(state, action) {
    return messageReceived(state, action, 'pongEvent')
}

function messageReceived(state, action, messageField) {
    // TODO Handle FETCHING state by queuing incoming events
    if (state.invalidationStatus !== InvalidationStatus.FETCHED)
        return state

    return immutable(state)
        .arraySetItem('followUps', {id: action[messageField].thing.id}, item => thingReducer(item, action))
        .value()
}

function statusChangedReceived(state, action) {
    if (state.invalidationStatus !== InvalidationStatus.FETCHED)
        return state

    // If followup and not exist, lets add it
    if (action.thing.isFollowUper && !some(state.followUps, {id: action.thing.id})) {
        return immutable(state)
            .arrayPushItem('followUps', action.thing)
            .value()
    } else {
        return immutable(state)
            .arraySetItem('followUps', {id: action.thing.id}, item => thingReducer(item, action))
            .arrayReject('followUps', {isFollowUper: false})
            .value()
    }
}

module.exports = (state = initialState, action) => {
    switch (action.type) {
        case FollowUpsActionTypes.SET_STATE:
            return setState(state, action)
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
        case EventActionTypes.ACCEPTED:
        case EventActionTypes.MARKED_AS_DONE:
        case EventActionTypes.DISMISSED:
        case EventActionTypes.CLOSED:
        case EventActionTypes.CANCEL_ACKED:
        case EventActionTypes.SENT_BACK:
            return statusChangedReceived(state, action)
        default:
            return state
    }
}
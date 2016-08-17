const some = require('lodash/some')
const merge = require('lodash/merge')

const ToDoActionTypes = require('../actions/types/to-do-action-types')
const ThingCommandActionTypes = require('../actions/types/thing-command-action-types')
const EventActionTypes = require('../actions/types/event-action-types')
const {ActionStatus, InvalidationStatus} = require('../constants')
const EventTypes = require('../../common/enums/event-types')
const thingReducer = require('./thing-reducer')
const immutable = require('../util/immutable')

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

function toDo(state, action) {
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

function commentChangedOrAdded(state, action) {
    return messageReceived(state, action, 'comment')
}

function pingReceived(state, action) {
    return messageReceived(state, action, 'pingEvent')
}

function pongReceived(state, action) {
    return messageReceived(state, action, 'pongEvent')
}

function messageReceived(state, action, messageField) {
    // TODO Handle FETCHING state by queuing incoming events
    if (state.invalidationStatus !== InvalidationStatus.FETCHED)
        return state

    return immutable(state)
        .arraySetItem('things', {id: action[messageField].thing.id}, item => thingReducer(item, action))
        .value()
}

function statusChangedReceived(state, action) {
    if (state.invalidationStatus !== InvalidationStatus.FETCHED)
        return state

    // If doer and not exist, lets add it
    if (action.thing.isDoer && !some(state.things, {id: action.thing.id})) {
        return immutable(state)
            .arrayPushItem('things', action.thing)
            .value()
    } else {
        return immutable(state)
            .arraySetItem('things', {id: action.thing.id}, item => thingReducer(item, action))
            .arrayReject('things', {isDoer: false})
            .value()
    }
}

module.exports = (state = initialState, action) => {
    switch (action.type) {
        case ToDoActionTypes.SET_STATE:
            return setState(state, action)
        case ToDoActionTypes.FETCH_TO_DO:
            return toDo(state, action)
        case ThingCommandActionTypes.MARK_AS_DONE:
        case ThingCommandActionTypes.DISMISS:
        case ThingCommandActionTypes.CANCEL_ACK:
            return actionDoneOnThing(state, action)
        case EventActionTypes.COMMENT_CREATED:
        case EventActionTypes.COMMENT_READ_BY:
            return commentChangedOrAdded(state, action)
        case EventActionTypes.PINGED:
            return pingReceived(state, action)
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

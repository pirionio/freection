const some = require('lodash/some')
const merge = require('lodash/merge')

const ToDoActionTypes = require('../actions/types/to-do-action-types')
const EventActionTypes = require('../actions/types/event-action-types')
const {ActionStatus, InvalidationStatus} = require('../constants')
const EventTypes = require('../../common/enums/event-types')
const thingReducer = require('./thing-reducer')
const immutable = require('../util/immutable')

const initialState = {
    things: [],
    invalidationStatus: InvalidationStatus.INVALIDATED
}

function toDo(state, action) {
    switch (action.status) {
        case ActionStatus.COMPLETE:
            return immutable(action)
                .arraySetAll('things', thing => {
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

function markThingAsDone(state, action) {
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

function createdOrAcceptedReceived(state, action) {
    // TODO Handle FETCHING state by queuing incoming events
    if (state.invalidationStatus !== InvalidationStatus.FETCHED)
        return state

    if (!action.thing.isDoer)
        return state

    // already exist?
    if (some(state.things, {id: action.thing.id}))
        return state

    // Adding to array
    return immutable(state)
        .arrayPushItem('things', action.thing)
        .value()
}

function doneOrDismissedReceived(state, action) {
    if (state.invalidationStatus !== InvalidationStatus.FETCHED)
        return state

    return immutable(state)
        .arrayReject('things', {id: action.thing.id})
        .value()
}

function commentChangedOrAdded(state, action) {
    // TODO Handle FETCHING state by queuing incoming events
    if (state.invalidationStatus !== InvalidationStatus.FETCHED)
        return state

    return immutable(state)
        .arraySetItem('things', {id: action.comment.thing.id}, item => thingReducer(item, action))
        .value()
}

function abortedReceived(state, action) {
    // TODO Handle FETCHING state by queuing incoming events
    if (state.invalidationStatus !== InvalidationStatus.FETCHED)
        return state

    return immutable(state)
        .arraySetItem('things', {id: action.thing.id}, item => thingReducer(item, action))
        .value()
}

function pingReceived(state, action) {
    // TODO Handle FETCHING state by queuing incoming events
    if (state.invalidationStatus !== InvalidationStatus.FETCHED)
        return state

    return immutable(state)
        .arraySetItem('things', {id: action.pingEvent.thing.id}, item => thingReducer(item, action))
        .value()
}

module.exports = (state = initialState, action) => {
    switch (action.type) {
        case ToDoActionTypes.FETCH_TO_DO:
            return toDo(state, action)
        case ToDoActionTypes.MARK_AS_DONE:
            return markThingAsDone(state, action)
        case EventActionTypes.CREATED:
        case EventActionTypes.ACCEPTED:
            return createdOrAcceptedReceived(state, action)
        case EventActionTypes.MARKED_AS_DONE:
        case EventActionTypes.DISMISSED:
            return doneOrDismissedReceived(state, action)
        case EventActionTypes.COMMENT_CREATED:
        case EventActionTypes.COMMENT_READ_BY:
            return commentChangedOrAdded(state, action)
        case EventActionTypes.ABORTED:
            return abortedReceived(state, action)
        case EventActionTypes.PINGED:
            return pingReceived(state, action)
        default:
            return state
    }
}

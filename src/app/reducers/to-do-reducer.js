const some = require('lodash/some')

const ToDoActionTypes = require('../actions/types/to-do-action-types')
const ThingActionTypes = require('../actions/types/thing-action-types')
const {ActionStatus, InvalidationStatus} = require('../constants')
const immutable = require('../util/immutable')
const thingReducer = require('./thing-reducer')

const initialState = {
    things: [],
    invalidationStatus: InvalidationStatus.INVALIDATED
}

function toDo(state, action) {
    switch (action.status) {
        case ActionStatus.COMPLETE:
            return {
                things: action.things,
                invalidationStatus: InvalidationStatus.FETCHED
            }
        case ActionStatus.START:
            return {
                things: state.things,
                invalidationStatus: InvalidationStatus.FETCHING
            }
        case ActionStatus.ERROR:
        default:
            return {
                things: state.things,
                invalidationStatus: InvalidationStatus.INVALIDATED
            }
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

function doneReceived(state, action) {
    // TODO Handle FETCHING state by queuing incoming events
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

module.exports = (state = initialState, action) => {
    switch (action.type) {
        case ToDoActionTypes.FETCH_TO_DO:
            return toDo(state, action)
        case ToDoActionTypes.MARK_THING_AS_DONE:
            return markThingAsDone(state, action)
        case ThingActionTypes.CREATED_RECEIVED:
        case ThingActionTypes.ACCEPTED_RECEIVED:
            return createdOrAcceptedReceived(state, action)
        case ThingActionTypes.DONE_RECEIVED:
            return doneReceived(state, action)
        case ThingActionTypes.NEW_COMMENT_RECEIVED:
        case ThingActionTypes.COMMENT_READ_BY_RECEIVED:
            return commentChangedOrAdded(state, action)
        default:
            return state
    }
}

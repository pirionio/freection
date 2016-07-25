const {some} = require('lodash/core')

const ToDoActionTypes = require('../actions/types/to-do-action-types')
const ThingActionTypes = require('../actions/types/thing-action-types')
const {ActionStatus} = require('../constants')
const {filter} = require('lodash/core')
const immutable = require('../util/immutable')
const thingReducer = require('./thing-reducer')

const initialState = {
    things: []
}

function toDo(state, action) {
    switch (action.status) {
        case ActionStatus.COMPLETE:
            return {
                things: action.things
            }
        case ActionStatus.START:
        default:
            return {
                things: state.things
            }
    }
}

function completeThing(state, action) {
    switch (action.status) {
        case ActionStatus.START:
            return {
                things: filter(state.things, thing => thing.id !== action.thing.id)
            }
        case ActionStatus.ERROR:
            // If there was an error, since we already removed the thing from the state, we now want to re-add it.
            return {
                things: [...state.things, action.thing]
            }
        case ActionStatus.COMPLETE:
        default:
            return {
                things: state.things
            }
    }
}

function createdOrAcceptedReceived(state, action) {
    if (!action.thing.isDoer)
        return state

    // already exist?
    if (some(state.things, thing => thing.id === action.thing.id))
        return state

    // Adding to array
    return Object.assign({}, state, {
        things: [...state.things, action.thing]
    })
}

function newCommentReceived(state, action) {
    return immutable(state)
        .arraySetItem('things', {id: action.comment.thing.id}, item => thingReducer(item, action))
        .value()
}

module.exports = (state = initialState, action) => {
    switch (action.type) {
        case ToDoActionTypes.FETCH_TO_DO:
            return toDo(state, action)
        case ToDoActionTypes.COMPLETE_THING:
            return completeThing(state, action)
        case ThingActionTypes.CREATED_RECEIVED:
        case ThingActionTypes.ACCEPTED_RECEIVED:
            return createdOrAcceptedReceived(state, action)
        case ThingActionTypes.NEW_COMMENT_RECEIVED:
            return newCommentReceived(state, action)
        default:
            return state
    }
}
const ToDoActionTypes = require('../actions/types/to-do-action-types')
const {ActionStatus} = require('../constants')
const {filter} = require('lodash')

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

module.exports = (state = initialState, action) => {
    switch (action.type) {
        case ToDoActionTypes.FETCH_TO_DO:
            return toDo(state, action)
        case ToDoActionTypes.COMPLETE_THING:
            return completeThing(state, action)
        default:
            return state
    }
}

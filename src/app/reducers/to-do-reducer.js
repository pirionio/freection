const ToDoActionTypes = require('../actions/types/to-do-action-types')
const {ActionStatus} = require('../constants')

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

module.exports = (state = initialState, action) => {
    switch (action.type) {
        case ToDoActionTypes.FETCH_TO_DO:
            return toDo(state, action)
        default:
            return state
    }
}

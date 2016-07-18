const TaskActionTypes = require('../actions/types/task-action-types')
const {ActionStatus} = require('../constants')

const initialState = {
    task: {},
    isFetching: false
}

function showFullTask(state, action) {
    switch (action.status) {
        case ActionStatus.START:
            return {
                task: {},
                isFetching: true
            }
        case ActionStatus.COMPLETE:
            return {
                task: action.task,
                isFetching: false
            }
        case ActionStatus.ERROR:
        default:
            return initialState
    }
}

function hideFullTask(state, action) {
    switch (action.status) {
        default:
            return initialState
    }
}

module.exports = (state = initialState, action) => {
    switch (action.type) {
        case TaskActionTypes.SHOW_FULL_TASK:
            return showFullTask(state, action)
        case TaskActionTypes.HIDE_FULL_TASK:
            return hideFullTask(state, action)
        default:
            return state
    }
}
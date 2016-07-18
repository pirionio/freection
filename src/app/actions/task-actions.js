const TaskActionTypes = require('./types/task-action-types')
const {ActionStatus} = require('../constants')
const TaskService = require('../services/task-service')

function showFullTaskRequest(taskId) {
    return {
        type: TaskActionTypes.SHOW_FULL_TASK,
        status: ActionStatus.START,
        taskId
    }
}

function showFullTaskComplete(task) {
    return {
        type: TaskActionTypes.SHOW_FULL_TASK,
        status: ActionStatus.COMPLETE,
        task
    }
}

function showFullTaskFailed(taskId) {
    return {
        type: TaskActionTypes.SHOW_FULL_TASK,
        status: ActionStatus.ERROR,
        taskId
    }
}

function hideFullTaskRequest(taskId) {
    return {
        type: TaskActionTypes.HIDE_FULL_TASK,
        status: ActionStatus.START,
        taskId
    }
}

const showFullTask = (taskId) => {
    return dispatch => {
        dispatch(showFullTaskRequest(taskId))
        TaskService.getTask(taskId)
            .then(task => dispatch(showFullTaskComplete(task)))
            .catch(error => dispatch(showFullTaskFailed(taskId)))
    }
}

const hideFullTask = (taskId) => {
    return dispatch => {
        dispatch(hideFullTaskRequest(taskId))
    }
}

module.exports = {showFullTask, hideFullTask}
const TaskActionTypes = require('../actions/types/task-action-types')
const ThingActionTypes = require('../actions/types/thing-action-types')
const {ActionStatus} = require('../constants')
const thingReducer = require('./thing-reducer')

const immutable = require('../util/immutable')

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

function createComment(state, action) {
    switch (action.status) {
        case ActionStatus.COMPLETE:
            return immutable(state)
                .touch('task')
                .arraySetOrPushItem('task.comments', {id: action.comment.id}, {
                    id: action.comment.id,
                    payload: action.comment.payload,
                    creator: action.comment.creator,
                    createdAt: action.comment.createdAt
                })
                .value()
        case ActionStatus.START:
        case ActionStatus.ERROR:
        default:
            return state
    }
}

function markCommentAsRead(state, action) {
    switch(action.status) {
        case ActionStatus.COMPLETE:
            return immutable(state)
                .touch('task')
                .arrayMergeItem('task.comments', {id: action.comment.id}, {
                    payload: {
                        isRead: true
                    }
                })
                .value()
        case ActionStatus.START:
        case ActionStatus.ERROR:
        default:
            return state
    }
}

module.exports = (state = initialState, action) => {
    switch (action.type) {
        case TaskActionTypes.SHOW_FULL_TASK:
            return showFullTask(state, action)
        case TaskActionTypes.HIDE_FULL_TASK:
            return hideFullTask(state, action)
        case ThingActionTypes.CREATE_COMMENT:
            return createComment(state, action)
        case ThingActionTypes.MARK_COMMENT_AS_READ:
            return markCommentAsRead(state, action)
        case ThingActionTypes.NEW_COMMENT_RECEIVED:
        case ThingActionTypes.COMMENT_READ_BY_RECEIVED:
            return immutable(state)
                .set('task', thingReducer(state.task, action))
                .value()
        default:
            return state
    }
}
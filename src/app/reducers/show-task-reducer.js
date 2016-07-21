const TaskActionTypes = require('../actions/types/task-action-types')
const ThingActionTypes = require('../actions/types/thing-action-types')
const {ActionStatus} = require('../constants')
const {merge} = require('lodash')

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
            return {
                // Keeping state intact, except adding the new comment to the comments list.
                task: Object.assign({}, state.task, {
                    comments: [...state.task.comments, {
                        id: action.comment.id,
                        payload: action.comment.payload,
                        creator: action.comment.creator,
                        createdAt: action.comment.createdAt
                    }]
                }),
                isFetching: state.isFetching
            }
        case ActionStatus.START:
        case ActionStatus.ERROR:
        default:
            return state
    }
}

function markCommentAsRead(state, action) {
    switch(action.status) {
        case ActionStatus.COMPLETE:
            return Object.assign({}, state, {
                task: Object.assign({}, state.task, {
                    comments: state.task.comments.map(comment => {
                        if (comment.id === action.comment.id) {
                            const t = merge({}, comment, {
                                payload: {
                                    isRead: true
                                }
                            })
                            return t
                        } else
                            return comment
                    })
                })
            })
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
        default:
            return state
    }
}
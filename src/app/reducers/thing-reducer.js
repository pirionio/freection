const ThingActionTypes = require('../actions/types/thing-action-types')
const TaskStatus = require('../../common/enums/task-status')
const immutable = require('../util/immutable')

function newCommentReceived(state, action) {
    return immutable(state)
        .arraySetOrPushItem('comments', comment => comment.id === action.comment.id, action.comment)
        .value()
}

function commentReadyByReceived(state, action) {
    return immutable(state)
        .arrayMergeItem('comments', comment => comment.id === action.comment.id, {
            payload: {
                isRead: true
            }
        })
        .value()
}

function statusChanged(state, action) {
    return immutable(state)
        .touch('payload')
        .set('payload.status', action.thing.payload.status)
        .value()
}

module.exports = (state, action) => {
    switch (action.type) {
        case ThingActionTypes.NEW_COMMENT_RECEIVED:
            return newCommentReceived(state, action)
        case ThingActionTypes.COMMENT_READ_BY_RECEIVED:
            return commentReadyByReceived(state, action)
        case ThingActionTypes.ACCEPTED_RECEIVED:
        case ThingActionTypes.DONE_RECEIVED:
        case ThingActionTypes.CLOSED_RECEIVED:
            return statusChanged(state, action)
        default:
            return state
    }
}

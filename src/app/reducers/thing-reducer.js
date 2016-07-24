const ThingActionTypes = require('../actions/types/thing-action-types')
const immutable = require('../util/immutable')

function newCommentReceived(state, action) {
    return immutable(state)
        .arraySetOrPushItem('comments', comment => comment.id === action.comment.id, action.comment)
        .value()
}

module.exports = (state, action) => {
    switch (action.type) {
        case ThingActionTypes.NEW_COMMENT_RECEIVED:
            return newCommentReceived(state, action)
        default:
            return state
    }
}

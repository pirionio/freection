const ThingActionTypes = require('../actions/types/thing-action-types')
const ThingCommandActionTypes = require('../actions/types/thing-command-action-types')
const immutable = require('../util/immutable')

function newCommentReceived(state, action) {
    return immutable(state)
        .arraySetOrPushItem('events', {id: action.comment.id}, action.comment)
        .value()
}

function pingReceived(state, action) {
    return immutable(state)
        .arraySetOrPushItem('events', {id: action.pingEvent.id}, action.pingEvent)
        .arrayMergeItem('events', {id: action.pingEvent.id}, {
            payload: {
                text: 'Ping!'
            }
        })
        .value()
}

function commentReadyByReceived(state, action) {
    return immutable(state)
        .arrayMergeItem('events', event => event.id === action.comment.id, {
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
        case ThingCommandActionTypes.PING:
        case ThingActionTypes.PING_RECEIVED:
            return pingReceived(state, action)
        case ThingActionTypes.ACCEPTED_RECEIVED:
        case ThingActionTypes.DONE_RECEIVED:
        case ThingActionTypes.CLOSED_RECEIVED:
        case ThingActionTypes.DISMISSED_RECEIVED:
        case ThingActionTypes.ABORTED_RECEIVED:
            return statusChanged(state, action)
        default:
            return state
    }
}

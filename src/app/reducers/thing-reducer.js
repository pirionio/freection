import EventActionTypes from '../actions/types/event-action-types'
import ThingCommandActionTypes from '../actions/types/thing-command-action-types'
import immutable from '../util/immutable'

function newCommentReceived(state, action) {
    return immutable(state)
        .arraySetOrPushItem('events', {id: action.event.id}, action.event)
        .value()
}

function pingReceived(state, action) {
    return immutable(state)
        .arraySetOrPushItem('events', {id: action.event.id}, action.event)
        .arrayMergeItem('events', {id: action.event.id}, {
            payload: {
                text: 'Ping!'
            }
        })
        .value()
}

function pongReceived(state, action) {
    return immutable(state)
        .arraySetOrPushItem('events', {id: action.event.id}, action.event)
        .value()
}

function commentReadyByReceived(state, action) {
    return immutable(state)
        .arrayMergeItem('events', event => event.id === action.event.id, {
            payload: {
                isRead: true
            }
        })
        .value()
}

function statusChanged(state, action) {
    return immutable(state)
        .touch('payload')
        .set('payload.status', action.event.thing.payload.status)
        .set('isDoer', action.event.thing.isDoer)
        .set('isFollowUper', action.event.thing.isFollowUper)
        .set('isMentioned', action.event.thing.isMentioned)
        .set('isSubscriber', action.event.thing.isSubscriber)
        .arraySetOrPushItem('events', {id: action.event.id}, action.event)
        .value()
}

export default (state, action) => {
    switch (action.type) {
        case EventActionTypes.COMMENT_CREATED:
            return newCommentReceived(state, action)
        case EventActionTypes.COMMENT_READ_BY:
            return commentReadyByReceived(state, action)
        case ThingCommandActionTypes.PING:
        case EventActionTypes.PINGED:
            return pingReceived(state, action)
        case EventActionTypes.PONGED:
            return pongReceived(state, action)
        case EventActionTypes.ACCEPTED:
        case EventActionTypes.MARKED_AS_DONE:
        case EventActionTypes.CLOSED:
        case EventActionTypes.DISMISSED:
        case EventActionTypes.SENT_BACK:
        case EventActionTypes.JOINED_MENTION:
        case EventActionTypes.LEFT_MENTION:
            return statusChanged(state, action)
        default:
            return state
    }
}

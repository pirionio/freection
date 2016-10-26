import EventActionTypes from '../actions/types/event-action-types'
import ThingCommandActionTypes from '../actions/types/thing-command-action-types'
import immutable from '../util/immutable'
import {ActionStatus} from '../constants'

function commentReadByReceived(state, action) {
    return immutable(state)
        .arrayMergeItem('events', event => event.id === action.event.id, {
            payload: {
                isRead: true
            }
        })
        .value()
}

function eventReceived(state, action, isPing) {
    const newState = immutable(state)
        .touch('payload')
        .set('payload.status', action.event.thing.payload.status)
        .set('isDoer', action.event.thing.isDoer)
        .set('isFollowUper', action.event.thing.isFollowUper)
        .set('isMentioned', action.event.thing.isMentioned)
        .set('isSubscriber', action.event.thing.isSubscriber)
        .arraySetOrPushItem('events', {id: action.event.id}, action.event)

    if (isPing) {
        newState.arrayMergeItem('events', {id: action.event.id}, {
            payload: {
                text: 'Ping!'
            }
        })
    }

    return newState.value()
}

function ping(state, action) {
    switch(action.status) {
        case ActionStatus.COMPLETE:
            return immutable(state)
                .touch('payload')
                .set('payload.status', action.thing.payload.status)
                .set('isDoer', action.thing.isDoer)
                .set('isFollowUper', action.thing.isFollowUper)
                .set('isMentioned', action.thing.isMentioned)
                .set('isSubscriber', action.thing.isSubscriber)
                .set('events', action.thing.events)
                .value()
        default:
            return state
    }
}

export default (state, action) => {
    switch (action.type) {
        case EventActionTypes.COMMENT_CREATED:
        case EventActionTypes.PONGED:
        case EventActionTypes.ACCEPTED:
        case EventActionTypes.MARKED_AS_DONE:
        case EventActionTypes.CLOSED:
        case EventActionTypes.DISMISSED:
        case EventActionTypes.SENT_BACK:
        case EventActionTypes.UNMUTED:
        case EventActionTypes.MUTED:
        case EventActionTypes.FOLLOW_UP:
        case EventActionTypes.UNFOLLOW:
            return eventReceived(state, action)
        case EventActionTypes.PINGED:
            return eventReceived(state, action, true)
        case ThingCommandActionTypes.PING:
            return ping(state, action)
        case EventActionTypes.COMMENT_READ_BY:
            return commentReadByReceived(state, action)
        default:
            return state
    }
}

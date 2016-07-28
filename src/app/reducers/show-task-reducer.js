const EventActionTypes = require('../actions/types/event-action-types')
const ThingPageActionTypes = require('../actions/types/thing-page-action-types')
const ThingStatus = require('../../common/enums/thing-status.js')
const ThingCommandActionTypes = require('../actions/types/thing-command-action-types')
const {ActionStatus} = require('../constants')
const thingReducer = require('./thing-reducer')

const immutable = require('../util/immutable')

const initialState = {
    task: {},
    isFetching: false
}

function get(state, action) {
    switch (action.status) {
        case ActionStatus.START:
            return {
                task: {},
                isFetching: true
            }
        case ActionStatus.COMPLETE:
            return {
                task: action.thing,
                isFetching: false
            }
        case ActionStatus.ERROR:
        default:
            return initialState
    }
}

function hide(state, action) {
    switch (action.status) {
        default:
            return initialState
    }
}

function comment(state, action) {
    switch (action.status) {
        case ActionStatus.COMPLETE:
            return immutable(state)
                .touch('task')
                .arraySetOrPushItem('task.events', {id: action.comment.id}, {
                    id: action.comment.id,
                    payload: action.comment.payload,
                    creator: action.comment.creator,
                    createdAt: action.comment.createdAt,
                    eventType: action.comment.eventType
                })
                .value()
        case ActionStatus.START:
        case ActionStatus.ERROR:
        default:
            return state
    }
}

function pingThing(state, action) {
    switch (action.status) {
        case ActionStatus.COMPLETE:
            return immutable(state)
                .touch('task')
                .arraySetOrPushItem('task.events', {id: action.pingEvent.id}, {
                    id: action.pingEvent.id,
                    payload: action.pingEvent.payload,
                    creator: action.pingEvent.creator,
                    createdAt: action.pingEvent.createdAt,
                    eventType: action.pingEvent.eventType
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
                .arrayMergeItem('task.events', {id: action.comment.id}, {
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

function commentChangedOrAdded(state, action) {
    // If no thing is shown right now, or if the action does not carry an event at all, or if the event does not belong to the shown thing...
    if (!state.task || !action.comment || !action.comment.thing || state.task.id !== action.comment.thing.id)
        return state

    return immutable(state)
        .set('task', thingReducer(state.task, action))
        .value()
}

function pingReceived(state, action) {
    // If no thing is shown right now, or if the action does not carry an event at all, or if the event does not belong to the shown thing...
    if (!state.task || !action.pingEvent || !action.pingEvent.thing || state.task.id !== action.pingEvent.thing.id)
        return state

    return immutable(state)
        .set('task', thingReducer(state.task, action))
        .value()
}

function statusChanged(state, action) {
    if (!state.task || !action.thing || state.task.id !== action.thing.id)
        return state

    return immutable(state)
        .set('task', thingReducer(state.task, action))
        .value()
}

function doThing(state, action) {
    return asyncStatusOperation(state, action, ThingStatus.INPROGRESS.key)
}

function dismissThing(state, action) {
    return asyncStatusOperation(state, action, ThingStatus.DISMISS.key)
}

function markThingAsDone(state, action) {
    return asyncStatusOperation(state, action, ThingStatus.DONE.key)
}

function closeThing(state, action) {
    return asyncStatusOperation(state, action, ThingStatus.CLOSE.key)
}

function abortThing(state, action) {
    return asyncStatusOperation(state, action, ThingStatus.ABORT.key)
}

function asyncStatusOperation(state, action, status) {
    if (!state.task || !action.thing || state.task.id !== action.thing.id)
        return state

    switch (action.status) {
        case ActionStatus.START:
            return immutable(state)
                .touch('task')
                .touch('task.payload')
                .set('task.payload.status',  status)
                .value()
        case ActionStatus.ERROR:
            // TODO: invalidate the thing to make the page re-fetch
            return state
        default:
            return state
    }
}

module.exports = (state = initialState, action) => {
    switch (action.type) {
        case ThingPageActionTypes.GET:
            return get(state, action)
        case ThingPageActionTypes.HIDE:
            return hide(state, action)
        case ThingCommandActionTypes.COMMENT:
            return comment(state, action)
        case ThingCommandActionTypes.PING:
            return pingThing(state, action)
        case ThingCommandActionTypes.MARK_COMMENT_AS_READ:
            return markCommentAsRead(state, action)
        case EventActionTypes.COMMENT_CREATED:
        case EventActionTypes.COMMENT_READ_BY:
            return commentChangedOrAdded(state, action)
        case EventActionTypes.PINGED:
            return pingReceived(state, action)
        case EventActionTypes.ACCEPTED:
        case EventActionTypes.MARKED_AS_DONE:
        case EventActionTypes.CLOSED:
        case EventActionTypes.DISMISSED:
        case EventActionTypes.ABORTED:
            return statusChanged(state, action)
        case ThingCommandActionTypes.DO_THING:
            return doThing(state, action)
        case ThingCommandActionTypes.MARK_AS_DONE:
            return markThingAsDone(state, action)
        case ThingCommandActionTypes.CLOSE:
            return closeThing(state, action)
        case ThingCommandActionTypes.DISMISS:
            return dismissThing(state, action)
        case ThingCommandActionTypes.ABORT:
            return abortThing(state, action)
        default:
            return state
    }
}

const TaskActionTypes = require('../actions/types/task-action-types')
const ThingActionTypes = require('../actions/types/thing-action-types')
const WhatsNewActionTypes = require('../actions/types/whats-new-action-types')
const ToDoActionTypes = require('../actions/types/to-do-action-types.js')
const TaskStatus = require('../../common/enums/task-status.js')
const ThingCommandActionTypes = require('../actions/types/thing-command-action-types')
const EventTypes = require('../../common/enums/event-types')
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
    return asyncStatusOperation(state, action, TaskStatus.INPROGRESS.key)
}

function dismissThing(state, action) {
    return asyncStatusOperation(state, action, TaskStatus.DISMISS.key)
}

function markThingAsDone(state, action) {
    return asyncStatusOperation(state, action, TaskStatus.DONE.key)
}

function closeThing(state, action) {
    return asyncStatusOperation(state, action, TaskStatus.CLOSE.key)
}

function abortThing(state, action) {
    return asyncStatusOperation(state, action, TaskStatus.ABORT.key)
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
        case TaskActionTypes.SHOW_FULL_TASK:
            return showFullTask(state, action)
        case TaskActionTypes.HIDE_FULL_TASK:
            return hideFullTask(state, action)
        case ThingCommandActionTypes.COMMENT:
            return comment(state, action)
        case ThingCommandActionTypes.PING:
            return pingThing(state, action)
        case ThingCommandActionTypes.MARK_COMMENT_AS_READ:
            return markCommentAsRead(state, action)
        case ThingActionTypes.NEW_COMMENT_RECEIVED:
        case ThingActionTypes.COMMENT_READ_BY_RECEIVED:
            return commentChangedOrAdded(state, action)
        case ThingActionTypes.PING_RECEIVED:
            return pingReceived(state, action)
        case ThingActionTypes.ACCEPTED_RECEIVED:
        case ThingActionTypes.DONE_RECEIVED:
        case ThingActionTypes.CLOSED_RECEIVED:
        case ThingActionTypes.DISMISSED_RECEIVED:
        case ThingActionTypes.ABORTED_RECEIVED:
            return statusChanged(state, action)
        case WhatsNewActionTypes.DO_THING:
            return doThing(state, action)
        case ToDoActionTypes.MARK_THING_AS_DONE:
            return markThingAsDone(state, action)
        case WhatsNewActionTypes.CLOSE_THING:
            return closeThing(state, action)
        case WhatsNewActionTypes.DISMISS_THING:
            return dismissThing(state, action)
        case WhatsNewActionTypes.ABORT_THING:
            return abortThing(state, action)
        default:
            return state
    }
}

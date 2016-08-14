const EventActionTypes = require('../actions/types/event-action-types')
const ThingPageActionTypes = require('../actions/types/thing-page-action-types')
const ThingStatus = require('../../common/enums/thing-status.js')
const EventTypes = require('../../common/enums/event-types')
const ThingCommandActionTypes = require('../actions/types/thing-command-action-types')
const {ActionStatus, InvalidationStatus} = require('../constants')
const thingReducer = require('./thing-reducer')
const isUndefined = require('lodash/isUndefined')

const immutable = require('../util/immutable')

// TODO Problems with the ongoingAction mechanism:
// 1) If navigating out of this state, the ongoingAction status is gone.
// 2) The ongoingAction status is changed right away - there's no delay.
// It means that components might react to it (and disable things in the view) even if the ongoing action takes millis.
// It might be that the only place to change this is in the action itself, that should trigger a state change within a given timeout...

const initialState = {
    thing: {},
    invalidationStatus: InvalidationStatus.INVALIDATED,
    ongoingAction: false
}

function getInitialReadBy(event) {
    if (isUndefined(event.payload.initialIsRead)) {
        return {
            payload: {
                initialIsRead: event.payload.isRead
            }
        }
    } else {
        return {}
    }
}

function get(state, action) {
    switch (action.status) {
        case ActionStatus.START:
            return immutable(state)
                .set('invalidationStatus', InvalidationStatus.FETCHING)
                .value()
        case ActionStatus.COMPLETE:
            return immutable(state)
                .set('thing', action.thing)
                .touch('thing')
                .arrayMergeItem('thing.events',
                    event => [EventTypes.COMMENT.key, EventTypes.PING.key].includes(event.eventType.key), getInitialReadBy)
                .set('invalidationStatus', InvalidationStatus.FETCHED)
                .value()
        case ActionStatus.ERROR:
            return immutable(state)
                .set('invalidationStatus', InvalidationStatus.INVALIDATED)
                .value()
        default:
            return state
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
                .touch('thing')
                .arraySetOrPushItem('thing.events', {id: action.comment.id}, {
                    id: action.comment.id,
                    payload: action.comment.payload,
                    creator: action.comment.creator,
                    createdAt: action.comment.createdAt,
                    eventType: action.comment.eventType
                })
                .arrayMergeItem('thing.events', {id: action.comment.id}, getInitialReadBy)
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
                .touch('thing')
                .arraySetOrPushItem('thing.events', {id: action.pingEvent.id}, {
                    id: action.pingEvent.id,
                    payload: action.pingEvent.payload,
                    creator: action.pingEvent.creator,
                    createdAt: action.pingEvent.createdAt,
                    eventType: action.pingEvent.eventType
                })
                .arrayMergeItem('thing.events', {id: action.pingEvent.id}, getInitialReadBy)
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
                .touch('thing')
                .arrayMergeItem('thing.events', {id: action.comment.id}, {
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
    if (!state.thing || !action.comment || !action.comment.thing || state.thing.id !== action.comment.thing.id)
        return state

    return immutable(state)
        .set('thing', thingReducer(state.thing, action))
        .touch('thing')
        .arrayMergeItem('thing.events', {id: action.comment.id}, getInitialReadBy)
        .value()
}

function pingReceived(state, action) {
    // If no thing is shown right now, or if the action does not carry an event at all, or if the event does not belong to the shown thing...
    if (!state.thing || !action.pingEvent || !action.pingEvent.thing || state.thing.id !== action.pingEvent.thing.id)
        return state

    return immutable(state)
        .set('thing', thingReducer(state.thing, action))
        .touch('thing')
        .arrayMergeItem('thing.events', {id: action.pingEvent.id}, getInitialReadBy)
        .value()
}

function statusChanged(state, action) {
    if (!state.thing || !action.thing || state.thing.id !== action.thing.id)
        return state

    return immutable(state)
        .set('thing', thingReducer(state.thing, action))
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

function asyncStatusOperation(state, action, status) {
    if (!state.thing || !action.thing || state.thing.id !== action.thing.id)
        return state

    switch (action.status) {
        case ActionStatus.START:
            return immutable(state)
                .set('ongoingAction', true)
                .value()
        case ActionStatus.COMPLETE:
            return immutable(state)
                .touch('thing')
                .touch('thing.payload')
                .set('thing.payload.status',  status)
                .set('ongoingAction', false)
                .value()
        case ActionStatus.ERROR:
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
            return statusChanged(state, action)
        case ThingCommandActionTypes.DO_THING:
            return doThing(state, action)
        case ThingCommandActionTypes.MARK_AS_DONE:
            return markThingAsDone(state, action)
        case ThingCommandActionTypes.CLOSE:
            return closeThing(state, action)
        case ThingCommandActionTypes.DISMISS:
            return dismissThing(state, action)
        default:
            return state
    }
}

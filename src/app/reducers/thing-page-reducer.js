import isUndefined from 'lodash/isUndefined'
import find from 'lodash/find'

import {isOfTypeEvent} from '../actions/types/event-action-types'
import SystemEventActionTypes from '../actions/types/system-event-action-types'
import ThingPageActionTypes from '../actions/types/thing-page-action-types'
import ThingStatus from '../../common/enums/thing-status.js'
import  ThingCommandActionTypes from '../actions/types/thing-command-action-types'
import SharedConstants from '../../common/shared-constants'
import {ActionStatus, InvalidationStatus} from '../constants'
import thingReducer from './thing-reducer'
import {getThingAllowedCommands} from '../services/thing-service.js'
import immutable from '../util/immutable'

const getCommands = thing => getThingAllowedCommands(thing, [
    ThingCommandActionTypes.DO_THING,
    ThingCommandActionTypes.MARK_AS_DONE,
    ThingCommandActionTypes.DISMISS,
    ThingCommandActionTypes.SEND_BACK,
    ThingCommandActionTypes.CLOSE,
    ThingCommandActionTypes.CANCEL,
    ThingCommandActionTypes.FOLLOW_UP,
    ThingCommandActionTypes.UNFOLLOW,
    ThingCommandActionTypes.CLOSED_UNFOLLOW,
    ThingCommandActionTypes.MUTE,
    ThingCommandActionTypes.UNMUTE
])

// TODO Problems with the ongoingAction mechanism:
// 1) If navigating out of this state, the ongoingAction status is gone.
// 2) The ongoingAction status is changed right away - there's no delay.
// It means that components might react to it (and disable things in the view) even if the ongoing action takes millis.
// It might be that the only place to change this is in the action itself, that should trigger a state change within a given timeout...

const initialState = {
    thing: {},
    commands: [],
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
    }

    return {}
}

function getUpdatedReadBy(event, thing) {
    const existingEvent = find(thing.events, {id: event.id})

    if (existingEvent) {
        return {
            payload: {
                initialIsRead: existingEvent.payload.initialIsRead
            }
        }
    }

    return getInitialReadBy(event)
}

function reconnected(state) {
    if (state.invalidationStatus === InvalidationStatus.FETCHED) {
        return immutable(state)
            .set('invalidationStatus', InvalidationStatus.REQUIRE_UPDATE)
            .value()
    }

    return state
}

function get(state, action) {
    switch (action.status) {
        case ActionStatus.START:
            const status = state.invalidationStatus === InvalidationStatus.REQUIRE_UPDATE ?
                InvalidationStatus.UPDATING :
                InvalidationStatus.FETCHING

            return immutable(state)
                .set('invalidationStatus', status)
                .value()
        case ActionStatus.COMPLETE:
            const {thing} = state

            return immutable(state)
                .set('thing', action.thing)
                .touch('thing')
                .arrayMergeItem('thing.events', event => SharedConstants.MESSAGE_TYPED_EVENTS.includes(event.eventType.key), event => {
                    if (state.invalidationStatus === InvalidationStatus.UPDATING)
                        return getUpdatedReadBy(event, thing)

                    return getInitialReadBy(event)
                })
                .set('commands', getCommands(action.thing))
                .set('invalidationStatus', InvalidationStatus.FETCHED)
                .set('ongoingAction', false)
                .value()
        case ActionStatus.ERROR:
            return immutable(state)
                .set('invalidationStatus', InvalidationStatus.INVALIDATED)
                .value()
        default:
            return state
    }
}

function show(state, action) {
    const {thing} = state

    return immutable(state)
        .set('thing', action.thing)
        .touch('thing')
        .arrayMergeItem('thing.events', event => SharedConstants.MESSAGE_TYPED_EVENTS.includes(event.eventType.key), event => {
            if (state.invalidationStatus === InvalidationStatus.UPDATING)
                return getUpdatedReadBy(event, thing)

            return getInitialReadBy(event)
        })
        .set('invalidationStatus', InvalidationStatus.FETCHED)
        .set('commands', getCommands(action.thing))
        .set('ongoingAction', false)
        .value()
}

function hide() {
    return initialState
}

function comment(state, action) {
    switch (action.status) {
        case ActionStatus.COMPLETE:
            return immutable(state)
                .touch('thing')
                .arraySetOrPushItem('thing.events', {id: action.event.id}, {
                    id: action.event.id,
                    payload: action.event.payload,
                    creator: action.event.creator,
                    createdAt: action.event.createdAt,
                    eventType: action.event.eventType
                })
                .arrayMergeItem('thing.events', {id: action.event.id}, getInitialReadBy)
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
                .arraySetOrPushItem('thing.events', {id: action.event.id}, {
                    id: action.event.id,
                    payload: action.event.payload,
                    creator: action.event.creator,
                    createdAt: action.event.createdAt,
                    eventType: action.event.eventType
                })
                .arrayMergeItem('thing.events', {id: action.event.id}, getInitialReadBy)
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
                .arrayMergeItem('thing.events', {id: action.event.id}, () => {
                    const result = {
                        payload: {
                            isRead: true
                        }
                    }
                    if (action.updateInitialIsRead) {
                        result.payload.initialIsRead = true
                    }
                    return result
                })
                .value()
        case ActionStatus.START:
        case ActionStatus.ERROR:
        default:
            return state
    }
}

function updateThing(state, action) {
    if (!state.thing || !action.event.thing || state.thing.id !== action.event.thing.id)
        return state

    const thing = thingReducer(state.thing, action)

    return immutable(state)
        .set('thing', thing)
        .touch('thing')
        .arrayMergeItem('thing.events', {id: action.event.id}, getInitialReadBy)
        .set('commands', getCommands(thing))
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

function sendBack(state, action) {
    return asyncStatusOperation(state, action, ThingStatus.REOPENED.key)
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
            const thing = immutable(state.thing)
                .touch('payload')
                .set('payload.status', currentStatus => updateStatus(currentStatus, status))
                .arrayMergeItem('events', {id: action.event.id}, getInitialReadBy)
                .value()

            return immutable(state)
                .set('ongoingAction', false)
                .set('thing', thing)
                .set('commands', getCommands(thing))
                .value()

        case ActionStatus.ERROR:
        default:
            return state
    }
}

function asyncOperation(state, action) {
    if (!state.thing || !action.thing || state.thing.id !== action.thing.id)
        return state

    switch (action.status) {
        case ActionStatus.START:
            return immutable(state)
                .set('ongoingAction', true)
                .value()
        case ActionStatus.COMPLETE:
            return immutable(state)
                .set('ongoingAction', false)
                .value()
        case ActionStatus.ERROR:
        default:
            return state
    }
}

function updateStatus(currentStatus, newStatus) {
    // TODO An aleternative to the following approach would be to get the Thing with its correct status in every async action against the server,
    // and then update the status here according to that result.
    // This is not done right now because many actions in the server return an event, and not the thing.
    // Getting the status from the event is not straight-forward.
    // We can change these server actions so that they'd return the thing.

    // We don't update the status in case it is CLOSED, because:
    // 1) This is our flow - there's no way back from CLOSED.
    // 2) More importantly, when the user clicks DONE on a self-assigned Thing, the server would change its status to Done and then Closed.
    // This reducer will get both server notifications, and update the status to Closed.
    // But in addition to that, this reducer will get the result of the actual call of the Done click asynchronously - after the two server
    // notifications. It will then change the status back to Done (as implied by the result of clicking Done).
    return currentStatus === ThingStatus.CLOSE.key ? currentStatus : newStatus
}

export default (state = initialState, action) => {
    switch (action.type) {
        case SystemEventActionTypes.RECONNECTED:
            return reconnected(state, action)
        case ThingPageActionTypes.GET_THING:
            return get(state, action)
        case ThingPageActionTypes.SHOW:
            return show(state, action)
        case ThingPageActionTypes.HIDE:
            return hide(state, action)
        case ThingCommandActionTypes.COMMENT:
            return comment(state, action)
        case ThingCommandActionTypes.PING:
            return pingThing(state, action)
        case ThingCommandActionTypes.DO_THING:
            return doThing(state, action)
        case ThingCommandActionTypes.MARK_AS_DONE:
            return markThingAsDone(state, action)
        case ThingCommandActionTypes.CLOSE:
        case ThingCommandActionTypes.CANCEL:
            return closeThing(state, action)
        case ThingCommandActionTypes.DISMISS:
            return dismissThing(state, action)
        case ThingCommandActionTypes.SEND_BACK:
            return sendBack(state, action)
        case ThingCommandActionTypes.MARK_COMMENT_AS_READ:
            return markCommentAsRead(state, action)
        case ThingCommandActionTypes.MUTE:
        case ThingCommandActionTypes.UNMUTE:
        case ThingCommandActionTypes.FOLLOW_UP:
        case ThingCommandActionTypes.UNFOLLOW:
            return asyncOperation(state, action)
        default:
            if (isOfTypeEvent(action.type)) {
                return updateThing(state, action)
            }

            return state
    }
}

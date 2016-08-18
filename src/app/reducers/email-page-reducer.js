const isUndefined = require('lodash/isUndefined')
const head = require('lodash/head')

const EventActionTypes = require('../actions/types/event-action-types')
const EmailPageActionTypes = require('../actions/types/email-page-action-types')
const EmailCommandActionTypes = require('../actions/types/email-command-action-types')
const {ActionStatus, InvalidationStatus} = require('../constants')

const immutable = require('../util/immutable')

const initialState = {
    thread: {},
    invalidationStatus: InvalidationStatus.INVALIDATED
}

function requireUpdate(state, action) {
    
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
            const {thread} = state

            return immutable(state)
                .set('thread', action.thread)
                .touch('thread')
                .arrayMergeItem('thread.messages', message => true, event => {
                    if (state.invalidationStatus === InvalidationStatus.UPDATING)
                        return getUpdatedReadBy(event, thread)
                    else
                        return getInitialReadBy(event)
                })
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

function replyToAll(state, action) {
    switch (action.status) {
        case ActionStatus.COMPLETE:
            return immutable(state)
                .touch('thread')
                .arraySetOrPushItem('thread.messages', {id: action.message.id}, {
                    id: action.message.id,
                    payload: action.message.payload,
                    creator: action.message.creator,
                    createdAt: action.message.createdAt,
                    eventType: action.message.type
                })
                .arrayMergeItem('thread.messages', {id: action.message.id}, getInitialReadBy)
                .value()
        case ActionStatus.START:
        case ActionStatus.ERROR:
        default:
            return state
    }
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

function getUpdatedReadBy(event, thread) {
    const existingMessage = head(thread.messages.filter(e => e.id === event.id))

    if (existingMessage) {
        return {payload: {
            initialIsRead: existingMessage.payload.initialIsRead
        }}
    } else {
        return getInitialReadBy(event)
    }
}

module.exports = (state = initialState, action) => {
    switch (action.type) {
        case EmailPageActionTypes.REQUIRE_UPDATE:
        case EventActionTypes.RECONNECTED:
            return requireUpdate(state, action)
        case EmailPageActionTypes.GET_EMAIL:
            return get(state, action)
        case EmailPageActionTypes.HIDE_EMAIL_PAGE:
            return hide(state, action)
        case EmailCommandActionTypes.REPLY_TO_ALL:
            return replyToAll(state, action)
        default:
            return state
    }
}
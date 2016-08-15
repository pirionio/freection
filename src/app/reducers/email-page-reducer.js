const isUndefined = require('lodash/isUndefined')

const EmailPageActionTypes = require('../actions/types/email-page-action-types')
const EmailCommandActionTypes = require('../actions/types/email-command-action-types')
const {ActionStatus, InvalidationStatus} = require('../constants')

const immutable = require('../util/immutable')

const initialState = {
    thread: {},
    invalidationStatus: InvalidationStatus.INVALIDATED,
}

function get(state, action) {
    switch (action.status) {
        case ActionStatus.START:
            return immutable(state)
                .set('invalidationStatus', InvalidationStatus.FETCHING)
                .value()
        case ActionStatus.COMPLETE:
            return immutable(state)
                .set('thread', action.thread)
                .touch('thread')
                .arrayMergeItem('thread.messages', message => true, getInitialReadBy)
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

module.exports = (state = initialState, action) => {
    switch (action.type) {
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
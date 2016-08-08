const isUndefined = require('lodash/isUndefined')

const EmailPageActionTypes = require('../actions/types/email-page-action-types')
const EmailCommandActionTypes = require('../actions/types/email-command-action-types')
const {ActionStatus} = require('../constants')

const immutable = require('../util/immutable')

const initialState = {
    thread: {},
    isFetching: false
}

function get(state, action) {
    switch (action.status) {
        case ActionStatus.START:
            return {
                thread: {},
                isFetching: true
            }
        case ActionStatus.COMPLETE:
            return {
                thread: action.thread,
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
        case EmailPageActionTypes.GET:
            return get(state, action)
        case EmailPageActionTypes.HIDE:
            return hide(state, action)
        case EmailCommandActionTypes.REPLY_TO_ALL:
            return replyToAll(state, action)
        default:
            return state
    }
}
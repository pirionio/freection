const EmailActionTypes = require('../actions/types/email-action-types')
const EmailCommandActionTypes = require('../actions/types/email-command-action-types')
const {ActionStatus} = require('../constants')
const {InvalidationStatus} = require('../constants')
const immutable = require('../util/immutable')

const initialState = {
    emails: [],
    invalidationStatus: InvalidationStatus.INVALIDATED
}

function invalidate(state, action) {
    if (state.invalidationStatus === InvalidationStatus.FETCHED) {
        return immutable(state)
            .set('invalidationStatus', InvalidationStatus.INVALIDATED)
            .value()
    } else
        return state
}

function fetchUnread(state, action) {
    switch (action.status) {
        case ActionStatus.COMPLETE:
            return immutable(action)
                .arraySetAll('emails', email => email)
                .set('invalidationStatus', InvalidationStatus.FETCHED)
                .value()
        case ActionStatus.START:
            return immutable(state)
                .set('invalidationStatus', InvalidationStatus.FETCHING)
                .value()
        case ActionStatus.ERROR:
        default:
            return immutable(state)
                .set('invalidationStatus', InvalidationStatus.INVALIDATED)
                .value()
    }
}

function updateUnread(state, action) {
    switch (action.status) {
        case ActionStatus.COMPLETE:
            return immutable(action)
                .arraySetAll('emails', email => email)
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

function markAsRead(state, action) {
    switch (action.status) {
        case ActionStatus.START:
            return immutable(state)
                .arrayReject('emails', email => action.emailUids.includes(email.payload.uid))
                .value()
        case ActionStatus.ERROR:
            return immutable(state)
                .set('invalidationStatus', InvalidationStatus.INVALIDATED)
                .value()
        case ActionStatus.COMPLETE:
        default:
            return state
    }
}

module.exports = (state = initialState, action) => {
    switch (action.type) {
        case EmailActionTypes.FETCH_UNREAD:
            return fetchUnread(state, action)
        case EmailActionTypes.UPDATE_UNREAD:
            return updateUnread(state, action)
        case EmailActionTypes.INVALIDATE:
            return invalidate(state, action)
        case EmailCommandActionTypes.MARK_AS_READ:
            return markAsRead(state, action)
        default:
            return state
    }
}
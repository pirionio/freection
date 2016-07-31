const EmailActionTypes = require('../actions/types/email-action-types')
const {ActionStatus} = require('../constants')
const {InvalidationStatus} = require('../constants')
const immutable = require('../util/immutable')

const initialState = {
    emails: [],
    invalidationStatus: InvalidationStatus.INVALIDATED
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

module.exports = (state = initialState, action) => {
    switch (action.type) {
        case EmailActionTypes.FETCH_UNREAD:
            return fetchUnread(state, action)
        default:
            return state
    }
}
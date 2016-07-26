const WhatsNewActionTypes = require('../actions/types/whats-new-action-types')
const {ActionStatus} = require('../constants')
const EventTypes = require('../../common/enums/event-types')
const {InvalidationStatus} = require('../constants')
const immutable = require('../util/immutable')

const initialState = {
    notifications: [],
    invalidationStatus: InvalidationStatus.INVALIDATED
}

function fetchWhatsNew(state, action) {
    switch (action.status) {
        case ActionStatus.COMPLETE:
            return {
                notifications: action.notifications,
                invalidationStatus: InvalidationStatus.FETCHED
            }
        case ActionStatus.START:
            return {
                notifications: state.notifications,
                invalidationStatus: InvalidationStatus.FETCHING
            }
        case ActionStatus.ERROR:
        default:
            return {
                notifications: state.notifications,
                invalidationStatus: InvalidationStatus.INVALIDATED
            }
    }
}

function doThing(state, action) {
    switch (action.status) {
        case ActionStatus.START:
            return immutable(state)
                .arrayReject('notifications', {id: action.notification.id})
                .value()
        case ActionStatus.ERROR:
            // If there was an error, since we already removed the notification from the state, we now want to re-add it.
            return immutable(state)
                .arrayPushItem('notifications', action.notification)
                .value()
        case ActionStatus.COMPLETE:
        default:
            return state
    }
}

function closeThing(state, action) {
    switch (action.status) {
        case ActionStatus.START:
            return immutable(state)
                .arrayReject('notifications', notification => notification.id === action.notification.id)
                .value()
        case ActionStatus.ERROR:
            // If there was an error, since we already removed the notification from the state, we now want to re-add it.
            return immutable(state)
                .arrayPushItem('notifications', action.notification)
                .value()
        case ActionStatus.COMPLETE:
        default:
            return state
    }
}

function dismissComments(state, action) {
    switch (action.status) {
        case ActionStatus.START:
            // Filter out all COMMENT notifications that belong to the specific Thing.
            return immutable(state)
                .arrayReject('notifications', notification =>
                    notification.eventType.key === EventTypes.COMMENT.key &&
                    notification.thing.id === action.notification.thing.id)
                .value()
        case ActionStatus.COMPLETE:
        default:
            return state
    }
}

function notificationReceived(state, action) {
    // TODO Handle FETCHING state by queuing incoming events
    if (state.invalidationStatus !== InvalidationStatus.FETCHED)
        return state

    return immutable(state)
        .arrayPushItem('notifications', action.notification)
        .value()
}

function notificationDeleted(state, action) {
    // TODO Handle FETCHING state by queuing incoming events
    if (state.invalidationStatus !== InvalidationStatus.FETCHED)
        return state

    return immutable(state)
        .arrayReject('notifications', {id: action.notification.id})
        .value()
}

module.exports = (state = initialState, action) => {
    switch (action.type) {
        case WhatsNewActionTypes.FETCH_WHATS_NEW:
            return fetchWhatsNew(state, action)
        case WhatsNewActionTypes.DO_THING:
            return doThing(state, action)
        case WhatsNewActionTypes.CLOSE_THING:
            return closeThing(state, action)
        case WhatsNewActionTypes.DISMISS_COMMENTS:
            return dismissComments(state, action)
        case WhatsNewActionTypes.NOTIFICATION_RECEIVED:
            return notificationReceived(state, action)
        case WhatsNewActionTypes.NOTIFICATION_DELETED:
            return notificationDeleted(state, action)
        default:
            return state
    }
}
const WhatsNewActionTypes = require('../actions/types/whats-new-action-types')
const {ActionStatus} = require('../constants')
const EventTypes = require('../../common/enums/event-types')
const {filter, reject, includes} = require('lodash')

const initialState = {
    notifications: []
}

function fetchWhatsNew(state, action) {
    switch (action.status) {
        case ActionStatus.COMPLETE:
            return {
                notifications: action.notifications
            }
        case ActionStatus.START:
        default:
            return {
                notifications: state.notifications
            }
    }
}

function doThing(state, action) {
    switch (action.status) {
        case ActionStatus.START:
            return {
                notifications: filter(state.notifications, notification => notification.id !== action.notification.id)
            }
        case ActionStatus.ERROR:
            // If there was an error, since we already removed the notification from the state, we now want to re-add it.
            return {
                notifications: [...state.notifications, action.notification]
            }
        case ActionStatus.COMPLETE:
        default:
            return {
                notifications: state.notifications
            }
    }
}

function dismissComments(state, action) {
    switch (action.status) {
        case ActionStatus.START:
            // Filter out all COMMENT notifications that I should read and that belong to the specific Thing.
            return {
                notifications: reject(state.notifications, notification =>
                    notification.eventType.key === EventTypes.COMMENT.key &&
                    notification.thing.id === action.notification.thing.id)
            }
        case ActionStatus.COMPLETE:
        default:
            return {
                notifications: state.notifications
            }
    }
}

function notificationReceived(state, action) {
    return {
        notifications: [...state.notifications, action.notification]
    }
}

function notificationDeleted(state, action) {
    return {
        notifications: reject(state.notification, notification => notification.id === action.notification.id)
    }
}

module.exports = (state = initialState, action) => {
    switch (action.type) {
        case WhatsNewActionTypes.FETCH_WHATS_NEW:
            return fetchWhatsNew(state, action)
        case WhatsNewActionTypes.DO_THING:
            return doThing(state, action)
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
const WhatsNewActionTypes = require('../actions/types/whats-new-action-types')
const {ActionStatus} = require('../constants')
const {filter} = require('lodash')

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
                notifications: filter(state.notifications, notification => notification.eventId !== action.notification.eventId)
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

module.exports = (state = initialState, action) => {
    switch (action.type) {
        case WhatsNewActionTypes.FETCH_WHATS_NEW:
            return fetchWhatsNew(state, action)
        case WhatsNewActionTypes.DO_THING:
            return doThing(state, action)
        default:
            return state
    }
}
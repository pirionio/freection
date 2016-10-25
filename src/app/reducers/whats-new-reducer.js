import WhatsNewActionTypes from '../actions/types/whats-new-action-types'
import ThingCommandActionTypes from '../actions/types/thing-command-action-types'
import {isOfTypeEvent} from '../actions/types/event-action-types'
import SystemEventActionTypes from '../actions/types/system-event-action-types'
import {ActionStatus, InvalidationStatus} from '../constants'
import EventTypes from '../../common/enums/event-types'
import thingReducer from './thing-reducer'
import immutable from '../util/immutable'

const initialState = {
    notifications: [],
    invalidationStatus: InvalidationStatus.INVALIDATED
}

function setState(state, action) {
    return {
        notifications: action.notifications,
        invalidationStatus: InvalidationStatus.FETCHED
    }
}

function reconnected(state) {
    if (state.invalidationStatus === InvalidationStatus.FETCHED) {
        return immutable(state)
            .set('invalidationStatus', InvalidationStatus.REQUIRE_UPDATE)
            .value()
    }

    return state
}

function fetchWhatsNew(state, action) {
    switch (action.status) {
        case ActionStatus.COMPLETE:
            return setState(state, action)
        case ActionStatus.START:
            const status = state.invalidationStatus === InvalidationStatus.REQUIRE_UPDATE ?
                InvalidationStatus.UPDATING :
                InvalidationStatus.FETCHING

            return immutable(state)
                .set('invalidationStatus', status)
                .value()
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
                .arrayReject('notifications', notification => notification.thing.id === action.thing.id &&
                    notification.eventType.key === EventTypes.CREATED.key)
                .value()
        case ActionStatus.ERROR:
            // If there was an error, invalidated entire page so component will re-fetch
            return immutable(state)
                .set('invalidationStatus', InvalidationStatus.INVALIDATED)
                .set('notifications', [])
                .value()
        default:
            return state
    }
}

function removeNotificationsOfThing(state, action) {
    switch (action.status) {
        case ActionStatus.START:
            return immutable(state)
                .arrayReject('notifications', notification => notification.thing.id === action.thing.id)
                .value()
        case ActionStatus.ERROR:
            // If there was an error, invalidated entire page so component will re-fetch
            return immutable(state)
                .set('invalidationStatus', InvalidationStatus.INVALIDATED)
                .set('notifications', [])
                .value()
        default:
            return state
    }
}

function discardComments(state, action) {
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

function discardSingleNotification(state, action) {
    switch (action.status) {
        case ActionStatus.START:
            return immutable(state)
                .arrayReject('notifications', {id: action.notification.id})
                .value()
        case ActionStatus.ERROR:
            return immutable(state)
                .arraySetOrPushItem('notifications', {id: action.notification.id}, action.notification)
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

function updateThing(state, action) {
    return immutable(state)
        .arraySetItem('notifications', notification => notification.thing.id === action.event.thing.id,
            notification => {
                return notification === action.event ? notification :
                    immutable(notification)
                        .set('thing', thingReducer(notification.thing, action))
                        .value()
            })
        .value()
}

export default (state = initialState, action) => {
    switch (action.type) {
        case WhatsNewActionTypes.SET_STATE:
            return setState(state, action)
        case SystemEventActionTypes.RECONNECTED:
            return reconnected(state, action)
        case WhatsNewActionTypes.FETCH_WHATS_NEW:
            return fetchWhatsNew(state, action)
        case ThingCommandActionTypes.DO_THING:
            return doThing(state, action)
        case ThingCommandActionTypes.DISMISS:
        case ThingCommandActionTypes.MARK_AS_DONE:
        case ThingCommandActionTypes.CLOSE:
        case ThingCommandActionTypes.CANCEL:
        case ThingCommandActionTypes.SEND_BACK:
        case ThingCommandActionTypes.CLOSE_ACK:
        case ThingCommandActionTypes.PONG:
            return removeNotificationsOfThing(state, action)
        case ThingCommandActionTypes.DISCARD_COMMENTS:
            return discardComments(state, action)
        case ThingCommandActionTypes.DISCARD_SINGLE_NOTIFICATION:
            return discardSingleNotification(state, action)
        case WhatsNewActionTypes.NOTIFICATION_RECEIVED:
            return notificationReceived(state, action)
        case WhatsNewActionTypes.NOTIFICATION_DELETED:
            return notificationDeleted(state, action)
        default:
            if (isOfTypeEvent(action.type))
                updateThing(state, action)

            return state
    }
}
import some from 'lodash/some'

import FollowUpsActionTypes from '../actions/types/follow-up-action-types'
import {isOfTypeEvent} from '../actions/types/event-action-types'
import SystemEventActionTypes from '../actions/types/system-event-action-types'
import ThingCommandActionTypes from '../actions/types/thing-command-action-types'
import {ActionStatus, InvalidationStatus} from '../constants'
import thingReducer from './thing-reducer'
import EventTypes from '../../common/enums/event-types'
import immutable from '../util/immutable'
import {getThingAllowedCommands} from '../services/thing-service.js'
import EntityTypes from '../../common/enums/entity-types.js'

function getCommands (thing) {
    const commands = thing.type.key === EntityTypes.SLACK.key ? [ThingCommandActionTypes.CLOSE] : [
        ThingCommandActionTypes.CLOSE,
        ThingCommandActionTypes.CLOSED_UNFOLLOW,
        ThingCommandActionTypes.SEND_BACK,
        ThingCommandActionTypes.PING]

    return getThingAllowedCommands(thing, commands)
}

const initialState = {
    followUps: [],
    invalidationStatus: InvalidationStatus.INVALIDATED
}

function setState(state, action) {
    return {
        invalidationStatus: InvalidationStatus.FETCHED,
        followUps: action.followUps.map(thing => {
            return createNewFollowup(thing)
        })
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

function fetchFollowUps(state, action) {
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
            return immutable(state)
                .set('invalidationStatus', InvalidationStatus.INVALIDATED)
                .value()
    }
}

function pingThing(state, action) {
    switch (action.status) {
        case ActionStatus.COMPLETE:
            return immutable(state)
                .arraySetItem('followUps', {id: action.event.thing.id}, followUp =>
                    createFollowup(thingReducer(followUp.thing, action)))
                .value()
        case ActionStatus.START:
        case ActionStatus.ERROR:
        default:
            return state
    }
}

function updateThing(state, action) {
    if (state.invalidationStatus !== InvalidationStatus.FETCHED)
        return state
 
    // If followup and not exist, lets add it
    if (action.event.thing.isFollowUper && !some(state.followUps, {id: action.event.thing.id})) {
        return immutable(state)
            .arrayPushItem('followUps', createNewFollowup(action.event.thing))
            .value()
    }

    return immutable(state)
        .arraySetItem('followUps', {id: action.event.thing.id}, item => createFollowup(thingReducer(item.thing, action)))
        .arrayReject('followUps', followup => !followup.thing.isFollowUper)
        .value()
}

function createNewFollowup(thing) {
    return createFollowup(immutable(thing)
        .arrayMergeItem('events', {eventType: {key: EventTypes.PING.key}}, {payload: {text: 'Ping!'}})
        .value())
}

function createFollowup(thing) {
    return {
        id: thing.id,
        thing,
        commands: getCommands(thing)
    }
}

export default (state = initialState, action) => {
    switch (action.type) {
        case FollowUpsActionTypes.SET_STATE:
            return setState(state, action)
        case SystemEventActionTypes.RECONNECTED:
            return reconnected(state)
        case FollowUpsActionTypes.FETCH_FOLLOW_UPS:
            return fetchFollowUps(state, action)
        case ThingCommandActionTypes.PING:
            return pingThing(state, action)
        default:
            if (isOfTypeEvent(action.type))
                return updateThing(state, action)

            return state
    }
}
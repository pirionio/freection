import some from 'lodash/some'

import ToDoActionTypes from '../actions/types/to-do-action-types'
import ThingCommandActionTypes from '../actions/types/thing-command-action-types'
import {isOfTypeEvent} from '../actions/types/event-action-types'
import SystemEventActionTypes from '../actions/types/system-event-action-types'
import {ActionStatus, InvalidationStatus} from '../constants'
import EventTypes from '../../common/enums/event-types'
import thingReducer from './thing-reducer'
import immutable from '../util/immutable'
import {getThingAllowedCommands} from '../services/thing-service.js'
import EntityTypes from '../../common/enums/entity-types.js'

const initialState = {
    todos: [],
    invalidationStatus: InvalidationStatus.INVALIDATED
}

function getCommands (thing) {
    const commands =
        thing.type.key === EntityTypes.THING.key ? [
            ThingCommandActionTypes.DO_THING,
            ThingCommandActionTypes.MARK_AS_DONE,
            ThingCommandActionTypes.DISMISS] :
        thing.type.key === EntityTypes.GITHUB.key ? [
            ThingCommandActionTypes.CLOSE,
            ThingCommandActionTypes.DISMISS
        ] :
        thing.type.key === EntityTypes.EMAIL_THING.key ? [
            ThingCommandActionTypes.CLOSE
        ] : []

    return getThingAllowedCommands(thing, commands)
}

function setState(state, action) {
    return {
        invalidationStatus: InvalidationStatus.FETCHED,
        todos : action.things.map(thing => {
            return createNewTodo(thing)
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

function toDo(state, action) {
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

function actionDoneOnThing(state, action) {
    switch (action.status) {
        case ActionStatus.START:
            return immutable(state)
                .arrayReject('todos', {id: action.thing.id})
                .value()
        case ActionStatus.ERROR:
            // If there was an error, since we already removed the thing from the state, we now want to re-add it.
            return immutable(state)
                .arrayPushItem('todos', createNewTodo(action.thing))
                .value()
        case ActionStatus.COMPLETE:
        default:
            return state
    }
}

function updateThing(state, action) {
    if (state.invalidationStatus !== InvalidationStatus.FETCHED)
        return state

    // If doer and not exist, lets add it
    if (action.event.thing.isDoer && !some(state.todos, {id: action.event.thing.id})) {
        return immutable(state)
            .arrayPushItem('todos', createNewTodo(action.event.thing))
            .value()
    }

    return immutable(state)
        .arraySetItem('todos', {id: action.event.thing.id}, item => createTodo(thingReducer(item.thing, action)))
        .arrayReject('todos', todo => !todo.thing.isDoer)
        .value()
}

function createNewTodo(thing) {
    return createTodo(immutable(thing)
        .arrayMergeItem('events', {eventType: {key: EventTypes.PING.key}}, {payload: {text: 'Ping!'}})
        .value())
}

function createTodo(thing) {
    return {
        id: thing.id,
        thing,
        commands: getCommands(thing)
    }
}

export default (state = initialState, action) => {
    switch (action.type) {
        case ToDoActionTypes.SET_STATE:
            return setState(state, action)
        case SystemEventActionTypes.RECONNECTED:
            return reconnected(state)
        case ToDoActionTypes.FETCH_TO_DO:
            return toDo(state, action)
        case ThingCommandActionTypes.MARK_AS_DONE:
        case ThingCommandActionTypes.DISMISS:
        case ThingCommandActionTypes.CLOSE_ACK:
            return actionDoneOnThing(state, action)
        default:
            if (isOfTypeEvent(action.type)) {
                return updateThing(state, action)
            }

            return state
    }
}

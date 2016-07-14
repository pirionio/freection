const ToDoActionTypes = require('./types/to-do-action-types')
const ThingService = require('../services/thing-service')
const {ActionStatus} = require('../constants')

function completeThingRequest(thing) {
    return {
        type: ToDoActionTypes.COMPLETE_THING,
        status: ActionStatus.START,
        thing
    }
}

function completeThingCompleted(thing) {
    return {
        type: ToDoActionTypes.COMPLETE_THING,
        status: ActionStatus.COMPLETE,
        thing
    }
}

function completeThingFailed(thing) {
    return {
        type: ToDoActionTypes.COMPLETE_THING,
        status: ActionStatus.ERROR,
        thing
    }
}

const completeThing = (thing) => {
    return dispatch => {
        dispatch(completeThingRequest(thing))
        ThingService.completeThing(thing).
            then(() => dispatch(completeThingCompleted(thing))).
            catch(() => dispatch(completeThingFailed(thing))
        )
    }
}

module.exports = {completeThing}
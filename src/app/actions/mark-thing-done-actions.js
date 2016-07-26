const ToDoActionTypes = require('./types/to-do-action-types')
const ThingService = require('../services/thing-service')
const {ActionStatus} = require('../constants')

function markThingAsDoneRequest(thing) {
    return {
        type: ToDoActionTypes.MARK_THING_AS_DONE,
        status: ActionStatus.START,
        thing
    }
}

function markThingAsDoneCompleted(thing) {
    return {
        type: ToDoActionTypes.MARK_THING_AS_DONE,
        status: ActionStatus.COMPLETE,
        thing
    }
}

function markThingAsDoneFailed(thing) {
    return {
        type: ToDoActionTypes.MARK_THING_AS_DONE,
        status: ActionStatus.ERROR,
        thing
    }
}

const markThingAsDone = (thing) => {
    return dispatch => {
        dispatch(markThingAsDoneRequest(thing))
        ThingService.markThingAsDone(thing).
            then(() => dispatch(markThingAsDoneCompleted(thing))).
            catch(() => dispatch(markThingAsDoneFailed(thing))
        )
    }
}

module.exports = {markThingAsDone}

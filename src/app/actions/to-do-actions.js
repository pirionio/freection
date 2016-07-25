const ToDoActionTypes = require('./types/to-do-action-types')
const ToDoService = require('../services/to-do-service')
const {ActionStatus, InvalidationStatus} = require('../constants')

function requestToDo() {
    return {
        type: ToDoActionTypes.FETCH_TO_DO,
        status: ActionStatus.START
    }
}

function requestToDoComplete(things) {
    return {
        type: ToDoActionTypes.FETCH_TO_DO,
        status: ActionStatus.COMPLETE,
        things
    }
}

function requestToDoFailed() {
    return {
        type: ToDoActionTypes.FETCH_TO_DO,
        status: ActionStatus.ERROR
    }
}

const fetchToDo = () => {
    return (dispatch, getState) => {
        const {toDo} = getState()
        if (toDo.invalidationStatus === InvalidationStatus.INVALIDATED) {
            dispatch(requestToDo())
            ToDoService.getThingsToDo().
                then(things => dispatch(requestToDoComplete(things))).
                catch(() => dispatch(requestToDoFailed()))
        }
    }
}

module.exports = {fetchToDo}
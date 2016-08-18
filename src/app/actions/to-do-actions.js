const ToDoActions = require('./generated/to-do-actions')
const {InvalidationStatus} = require('../constants')

const fetchToDoActions = ToDoActions.fetchToDo

const fetchToDo = () => {
    return (dispatch, getState) => {
        const {toDo} = getState()
        if (toDo.invalidationStatus === InvalidationStatus.INVALIDATED ||
            toDo.invalidationStatus === InvalidationStatus.REQUIRE_UPDATE) {
            dispatch(fetchToDoActions())
        }
    }
}

module.exports = ToDoActions
module.exports.fetchToDo = fetchToDo
const ToDoActionsTypes = require('../types/to-do-action-types')
const {ActionStatus} = require('../../constants')
const ResourceUtil = require('../../util/resource-util')

function setState(things) {
    return {
        type: ToDoActionsTypes.SET_STATE,
        things
    }
}

function fetchToDo() {
    return dispatch => {
        dispatch({
            type: ToDoActionsTypes.FETCH_TO_DO, 
            status: ActionStatus.START            
        })
        return ResourceUtil.get(`/api/things/do`)
            .then(result => dispatch({
                type: ToDoActionsTypes.FETCH_TO_DO, 
                status: ActionStatus.COMPLETE,
                things: result
            }))
            .catch(() => dispatch({
                type: ToDoActionsTypes.FETCH_TO_DO, 
                status: ActionStatus.ERROR                
            }))
    }
}

module.exports = {
    setState,
    fetchToDo
}
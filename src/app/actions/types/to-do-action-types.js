const ToDoActionsTypes = {
    SET_STATE: 'TO_DO_SET_STATE',
    FETCH_TO_DO: 'TO_DO_FETCH_TO_DO'
}

export default ToDoActionsTypes

export function isOfTypeToDo(type) {
    switch(type) {
        case ToDoActionsTypes.SET_STATE:
        case ToDoActionsTypes.FETCH_TO_DO:
            return true
        default:
            return false
    }
}
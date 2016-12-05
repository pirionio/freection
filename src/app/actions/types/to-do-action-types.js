const ToDoActionsTypes = {
    SET_STATE: 'TO_DO_SET_STATE',
    FETCH_TO_DO: 'TO_DO_FETCH_TO_DO',
    REORDER_DRAG: 'TO_DO_REORDER_DRAG',
    MOVE_TO_GROUP: 'TO_DO_MOVE_TO_GROUP',
    SET_TODOS: 'TO_DO_SET_TODOS'
}

export default ToDoActionsTypes

export function isOfTypeToDo(type) {
    switch(type) {
        case ToDoActionsTypes.SET_STATE:
        case ToDoActionsTypes.FETCH_TO_DO:
        case ToDoActionsTypes.REORDER_DRAG:
        case ToDoActionsTypes.MOVE_TO_GROUP:
        case ToDoActionsTypes.SET_TODOS:
            return true
        default:
            return false
    }
}
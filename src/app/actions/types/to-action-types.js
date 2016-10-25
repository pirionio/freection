const ToActionsTypes = {
    GET: 'TO_GET',
    CLEAR: 'TO_CLEAR',
    GET_FROM_CACHE: 'TO_GET_FROM_CACHE'
}

export default ToActionsTypes

export function isOfTypeTo(type) {
    switch(type) {
        case ToActionsTypes.GET:
        case ToActionsTypes.CLEAR:
        case ToActionsTypes.GET_FROM_CACHE:
            return true
        default:
            return false
    }
}
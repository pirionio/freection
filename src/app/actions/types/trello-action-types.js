const TrelloActionsTypes = {
    FETCH_USER_INFO: 'TRELLO_FETCH_USER_INFO',
    ENABLE_BOARD: 'TRELLO_ENABLE_BOARD',
    DISABLE_BOARD: 'TRELLO_DISABLE_BOARD'
}

export default TrelloActionsTypes

export function isOfTypeTrello(type) {
    switch(type) {
        case TrelloActionsTypes.FETCH_USER_INFO:
        case TrelloActionsTypes.ENABLE_BOARD:
        case TrelloActionsTypes.DISABLE_BOARD:
            return true
        default:
            return false
    }
}
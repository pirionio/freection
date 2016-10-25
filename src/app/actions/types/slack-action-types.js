const SlackActionsTypes = {
    FETCH: 'SLACK_FETCH'
}

export default SlackActionsTypes

export function isOfTypeSlack(type) {
    switch(type) {
        case SlackActionsTypes.FETCH:
            return true
        default:
            return false
    }
}
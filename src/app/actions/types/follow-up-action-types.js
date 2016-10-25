const FollowUpActionsTypes = {
    SET_STATE: 'FOLLOW_UP_SET_STATE',
    FETCH_FOLLOW_UPS: 'FOLLOW_UP_FETCH_FOLLOW_UPS'
}

export default FollowUpActionsTypes

export function isOfTypeFollowUp(type) {
    switch(type) {
        case FollowUpActionsTypes.SET_STATE:
        case FollowUpActionsTypes.FETCH_FOLLOW_UPS:
            return true
        default:
            return false
    }
}
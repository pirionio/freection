const MentionsActionsTypes = {
    SET_STATE: 'MENTIONS_SET_STATE',
    FETCH_MENTIONS: 'MENTIONS_FETCH_MENTIONS'
}

export default MentionsActionsTypes

export function isOfTypeMentions(type) {
    switch(type) {
        case MentionsActionsTypes.SET_STATE:
        case MentionsActionsTypes.FETCH_MENTIONS:
            return true
        default:
            return false
    }
}
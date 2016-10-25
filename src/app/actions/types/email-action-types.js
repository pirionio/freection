const EmailActionsTypes = {
    FETCH_UNREAD: 'EMAIL_FETCH_UNREAD',
    UPDATE_UNREAD: 'EMAIL_UPDATE_UNREAD',
    HELLO: 'EMAIL_HELLO',
    INVALIDATE: 'EMAIL_INVALIDATE'
}

export default EmailActionsTypes

export function isOfTypeEmail(type) {
    switch(type) {
        case EmailActionsTypes.FETCH_UNREAD:
        case EmailActionsTypes.UPDATE_UNREAD:
        case EmailActionsTypes.HELLO:
        case EmailActionsTypes.INVALIDATE:
            return true
        default:
            return false
    }
}
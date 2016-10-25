const WhatsNewActionsTypes = {
    SET_STATE: 'WHATS_NEW_SET_STATE',
    FETCH_WHATS_NEW: 'WHATS_NEW_FETCH_WHATS_NEW',
    NOTIFICATION_RECEIVED: 'WHATS_NEW_NOTIFICATION_RECEIVED',
    NOTIFICATION_DELETED: 'WHATS_NEW_NOTIFICATION_DELETED'
}

export default WhatsNewActionsTypes

export function isOfTypeWhatsNew(type) {
    switch(type) {
        case WhatsNewActionsTypes.SET_STATE:
        case WhatsNewActionsTypes.FETCH_WHATS_NEW:
        case WhatsNewActionsTypes.NOTIFICATION_RECEIVED:
        case WhatsNewActionsTypes.NOTIFICATION_DELETED:
            return true
        default:
            return false
    }
}
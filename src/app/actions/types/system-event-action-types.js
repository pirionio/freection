const SystemEventActionsTypes = {
    RECONNECTED: 'SYSTEM_EVENT_RECONNECTED'
}

export default SystemEventActionsTypes

export function isOfTypeSystemEvent(type) {
    switch(type) {
        case SystemEventActionsTypes.RECONNECTED:
            return true
        default:
            return false
    }
}
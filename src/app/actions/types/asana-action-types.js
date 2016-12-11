const AsanaActionsTypes = {
    FETCH_ASANA: 'ASANA_FETCH_ASANA',
    ENABLE_PROJECT: 'ASANA_ENABLE_PROJECT',
    DISABLE_PROJECT: 'ASANA_DISABLE_PROJECT'
}

export default AsanaActionsTypes

export function isOfTypeAsana(type) {
    switch(type) {
        case AsanaActionsTypes.FETCH_ASANA:
        case AsanaActionsTypes.ENABLE_PROJECT:
        case AsanaActionsTypes.DISABLE_PROJECT:
            return true
        default:
            return false
    }
}
const MessageBoxActionsTypes = {
    NEW_MESSAGE_BOX: 'MESSAGE_BOX_NEW_MESSAGE_BOX',
    SELECT_MESSAGE_BOX: 'MESSAGE_BOX_SELECT_MESSAGE_BOX',
    MESSAGE_SENT: 'MESSAGE_BOX_MESSAGE_SENT',
    CLOSE_MESSAGE_BOX: 'MESSAGE_BOX_CLOSE_MESSAGE_BOX',
    SET_FOCUS: 'MESSAGE_BOX_SET_FOCUS',
    OPEN_EXPANDED: 'MESSAGE_BOX_OPEN_EXPANDED',
    CLOSE_EXPANDED: 'MESSAGE_BOX_CLOSE_EXPANDED'
}

export default MessageBoxActionsTypes

export function isOfTypeMessageBox(type) {
    switch(type) {
        case MessageBoxActionsTypes.NEW_MESSAGE_BOX:
        case MessageBoxActionsTypes.SELECT_MESSAGE_BOX:
        case MessageBoxActionsTypes.MESSAGE_SENT:
        case MessageBoxActionsTypes.CLOSE_MESSAGE_BOX:
        case MessageBoxActionsTypes.SET_FOCUS:
        case MessageBoxActionsTypes.OPEN_EXPANDED:
        case MessageBoxActionsTypes.CLOSE_EXPANDED:
            return true
        default:
            return false
    }
}
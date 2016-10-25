const EmailCommandActionsTypes = {
    NEW_EMAIL: 'EMAIL_COMMAND_NEW_EMAIL',
    DO_EMAIL: 'EMAIL_COMMAND_DO_EMAIL',
    REPLY_TO_ALL: 'EMAIL_COMMAND_REPLY_TO_ALL',
    MARK_AS_READ: 'EMAIL_COMMAND_MARK_AS_READ'
}

export default EmailCommandActionsTypes

export function isOfTypeEmailCommand(type) {
    switch(type) {
        case EmailCommandActionsTypes.NEW_EMAIL:
        case EmailCommandActionsTypes.DO_EMAIL:
        case EmailCommandActionsTypes.REPLY_TO_ALL:
        case EmailCommandActionsTypes.MARK_AS_READ:
            return true
        default:
            return false
    }
}
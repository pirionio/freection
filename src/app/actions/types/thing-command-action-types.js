const ThingCommandActionsTypes = {
    COMMENT: 'THING_COMMAND_COMMENT',
    NEW_THING: 'THING_COMMAND_NEW_THING',
    PING: 'THING_COMMAND_PING',
    PONG: 'THING_COMMAND_PONG',
    MARK_COMMENT_AS_READ: 'THING_COMMAND_MARK_COMMENT_AS_READ',
    DO_THING: 'THING_COMMAND_DO_THING',
    CLOSE_ACK: 'THING_COMMAND_CLOSE_ACK',
    CLOSE: 'THING_COMMAND_CLOSE',
    DISMISS: 'THING_COMMAND_DISMISS',
    MARK_AS_DONE: 'THING_COMMAND_MARK_AS_DONE',
    DISCARD_COMMENTS: 'THING_COMMAND_DISCARD_COMMENTS',
    DISCARD_SINGLE_NOTIFICATION: 'THING_COMMAND_DISCARD_SINGLE_NOTIFICATION',
    UNMUTE: 'THING_COMMAND_UNMUTE',
    MUTE: 'THING_COMMAND_MUTE',
    SEND_BACK: 'THING_COMMAND_SEND_BACK',
    FOLLOW_UP: 'THING_COMMAND_FOLLOW_UP',
    UNFOLLOW: 'THING_COMMAND_UNFOLLOW',
    CLOSED_UNFOLLOW: 'THING_COMMAND_CLOSED_UNFOLLOW'
}

export default ThingCommandActionsTypes

export function isOfTypeThingCommand(type) {
    switch(type) {
        case ThingCommandActionsTypes.COMMENT:
        case ThingCommandActionsTypes.NEW_THING:
        case ThingCommandActionsTypes.PING:
        case ThingCommandActionsTypes.PONG:
        case ThingCommandActionsTypes.MARK_COMMENT_AS_READ:
        case ThingCommandActionsTypes.DO_THING:
        case ThingCommandActionsTypes.CLOSE_ACK:
        case ThingCommandActionsTypes.CLOSE:
        case ThingCommandActionsTypes.DISMISS:
        case ThingCommandActionsTypes.MARK_AS_DONE:
        case ThingCommandActionsTypes.DISCARD_COMMENTS:
        case ThingCommandActionsTypes.DISCARD_SINGLE_NOTIFICATION:
        case ThingCommandActionsTypes.UNMUTE:
        case ThingCommandActionsTypes.MUTE:
        case ThingCommandActionsTypes.SEND_BACK:
        case ThingCommandActionsTypes.FOLLOW_UP:
        case ThingCommandActionsTypes.UNFOLLOW:
        case ThingCommandActionsTypes.CLOSED_UNFOLLOW:
            return true
        default:
            return false
    }
}
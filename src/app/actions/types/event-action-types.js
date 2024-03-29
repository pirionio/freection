const EventActionsTypes = {
    CREATED: 'EVENT_CREATED',
    ACCEPTED: 'EVENT_ACCEPTED',
    MARKED_AS_DONE: 'EVENT_MARKED_AS_DONE',
    CLOSED: 'EVENT_CLOSED',
    CLOSE_ACKED: 'EVENT_CLOSE_ACKED',
    DISMISSED: 'EVENT_DISMISSED',
    SENT_BACK: 'EVENT_SENT_BACK',
    PINGED: 'EVENT_PINGED',
    PONGED: 'EVENT_PONGED',
    UNMUTED: 'EVENT_UNMUTED',
    MUTED: 'EVENT_MUTED',
    FOLLOW_UP: 'EVENT_FOLLOW_UP',
    UNFOLLOW: 'EVENT_UNFOLLOW',
    UNASSIGNED: 'EVENT_UNASSIGNED',
    COMMENT_CREATED: 'EVENT_COMMENT_CREATED',
    COMMENT_READ_BY: 'EVENT_COMMENT_READ_BY',
    COMMENT_READ_BY_EMAIL: 'EVENT_COMMENT_READ_BY_EMAIL',
    TRELLO_LIST_CHANGED: 'EVENT_TRELLO_LIST_CHANGED'
}

export default EventActionsTypes

export function isOfTypeEvent(type) {
    switch(type) {
        case EventActionsTypes.CREATED:
        case EventActionsTypes.ACCEPTED:
        case EventActionsTypes.MARKED_AS_DONE:
        case EventActionsTypes.CLOSED:
        case EventActionsTypes.CLOSE_ACKED:
        case EventActionsTypes.DISMISSED:
        case EventActionsTypes.SENT_BACK:
        case EventActionsTypes.PINGED:
        case EventActionsTypes.PONGED:
        case EventActionsTypes.UNMUTED:
        case EventActionsTypes.MUTED:
        case EventActionsTypes.FOLLOW_UP:
        case EventActionsTypes.UNFOLLOW:
        case EventActionsTypes.UNASSIGNED:
        case EventActionsTypes.COMMENT_CREATED:
        case EventActionsTypes.COMMENT_READ_BY:
        case EventActionsTypes.COMMENT_READ_BY_EMAIL:
        case EventActionsTypes.TRELLO_LIST_CHANGED:
            return true
        default:
            return false
    }
}
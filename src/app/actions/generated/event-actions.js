import EventActionsTypes from '../types/event-action-types'
import {ActionStatus} from '../../constants'
import * as ResourceUtil from '../../util/resource-util'

export function created(event) {
    return {
        type: EventActionsTypes.CREATED,
        event
    }
}

export function accepted(event) {
    return {
        type: EventActionsTypes.ACCEPTED,
        event
    }
}

export function markedAsDone(event) {
    return {
        type: EventActionsTypes.MARKED_AS_DONE,
        event
    }
}

export function closed(event) {
    return {
        type: EventActionsTypes.CLOSED,
        event
    }
}

export function closeAcked(event) {
    return {
        type: EventActionsTypes.CLOSE_ACKED,
        event
    }
}

export function dismissed(event) {
    return {
        type: EventActionsTypes.DISMISSED,
        event
    }
}

export function sentBack(event) {
    return {
        type: EventActionsTypes.SENT_BACK,
        event
    }
}

export function pinged(event) {
    return {
        type: EventActionsTypes.PINGED,
        event
    }
}

export function ponged(event) {
    return {
        type: EventActionsTypes.PONGED,
        event
    }
}

export function unmuted(event) {
    return {
        type: EventActionsTypes.UNMUTED,
        event
    }
}

export function muted(event) {
    return {
        type: EventActionsTypes.MUTED,
        event
    }
}

export function followUp(event) {
    return {
        type: EventActionsTypes.FOLLOW_UP,
        event
    }
}

export function unfollow(event) {
    return {
        type: EventActionsTypes.UNFOLLOW,
        event
    }
}

export function unassigned(event) {
    return {
        type: EventActionsTypes.UNASSIGNED,
        event
    }
}

export function commentCreated(event) {
    return {
        type: EventActionsTypes.COMMENT_CREATED,
        event
    }
}

export function commentReadBy(event) {
    return {
        type: EventActionsTypes.COMMENT_READ_BY,
        event
    }
}

export function commentReadByEmail(event) {
    return {
        type: EventActionsTypes.COMMENT_READ_BY_EMAIL,
        event
    }
}

export function trelloListChanged(event) {
    return {
        type: EventActionsTypes.TRELLO_LIST_CHANGED,
        event
    }
}

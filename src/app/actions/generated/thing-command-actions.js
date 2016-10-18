import ThingCommandActionsTypes from '../types/thing-command-action-types'
import {ActionStatus} from '../../constants'
import * as ResourceUtil from '../../util/resource-util'
import * as analytics from '../../util/analytics'
import EventTypes from '../../../common/enums/event-types'

export function _comment(thingId, commentText) {
    return dispatch => {
        analytics.comment()

        dispatch({
            type: ThingCommandActionsTypes.COMMENT, 
            status: ActionStatus.START,
            thingId,
            commentText
        })
        return ResourceUtil.post(`/api/things/${thingId}/comment`, {
                commentText: commentText
            })
            .then(result => dispatch({
                type: ThingCommandActionsTypes.COMMENT, 
                status: ActionStatus.COMPLETE,
                thingId: thingId,
                event: result
            }))
            .catch(() => dispatch({
                type: ThingCommandActionsTypes.COMMENT, 
                status: ActionStatus.ERROR,
                thingId,
                commentText
            }))
    }
}

export function newThing(thing) {
    return dispatch => {
        analytics.newThing()

        dispatch({
            type: ThingCommandActionsTypes.NEW_THING, 
            status: ActionStatus.START,
            thing
        })
        return ResourceUtil.post(`/api/new/thing`, {
                to: thing.to,
                body: thing.body,
                subject: thing.subject
            })
            .then(result => dispatch({
                type: ThingCommandActionsTypes.NEW_THING, 
                status: ActionStatus.COMPLETE,
                thing
            }))
            .catch(() => dispatch({
                type: ThingCommandActionsTypes.NEW_THING, 
                status: ActionStatus.ERROR,
                thing
            }))
    }
}

export function ping(thing) {
    return dispatch => {
        analytics.ping()

        dispatch({
            type: ThingCommandActionsTypes.PING, 
            status: ActionStatus.START,
            thing
        })
        return ResourceUtil.post(`/api/things/${thing.id}/ping`)
            .then(result => dispatch({
                type: ThingCommandActionsTypes.PING, 
                status: ActionStatus.COMPLETE,
                thing: thing,
                event: result
            }))
            .catch(() => dispatch({
                type: ThingCommandActionsTypes.PING, 
                status: ActionStatus.ERROR,
                thing
            }))
    }
}

export function pong(thing, messageText) {
    return dispatch => {
        analytics.pong()

        dispatch({
            type: ThingCommandActionsTypes.PONG, 
            status: ActionStatus.START,
            thing,
            messageText
        })
        return ResourceUtil.post(`/api/things/${thing.id}/pong`, {
                messageText: messageText
            })
            .then(result => dispatch({
                type: ThingCommandActionsTypes.PONG, 
                status: ActionStatus.COMPLETE,
                thing: thing
            }))
            .catch(() => dispatch({
                type: ThingCommandActionsTypes.PONG, 
                status: ActionStatus.ERROR,
                thing,
                messageText
            }))
    }
}

export function markCommentAsRead(comment, updateInitialIsRead) {
    return dispatch => {
        dispatch({
            type: ThingCommandActionsTypes.MARK_COMMENT_AS_READ, 
            status: ActionStatus.START,
            comment,
            updateInitialIsRead
        })
        return ResourceUtil.post(`/api/events/${comment.id}/markasread`)
            .then(result => dispatch({
                type: ThingCommandActionsTypes.MARK_COMMENT_AS_READ, 
                status: ActionStatus.COMPLETE,
                event: comment,
                updateInitialIsRead: updateInitialIsRead
            }))
            .catch(() => dispatch({
                type: ThingCommandActionsTypes.MARK_COMMENT_AS_READ, 
                status: ActionStatus.ERROR,
                comment,
                updateInitialIsRead
            }))
    }
}

export function doThing(thing) {
    return dispatch => {
        analytics.doThing()

        dispatch({
            type: ThingCommandActionsTypes.DO_THING, 
            status: ActionStatus.START,
            thing
        })
        return ResourceUtil.post(`/api/things/${thing.type.key}/${thing.id}/do`)
            .then(result => dispatch({
                type: ThingCommandActionsTypes.DO_THING, 
                status: ActionStatus.COMPLETE,
                thing
            }))
            .catch(() => dispatch({
                type: ThingCommandActionsTypes.DO_THING, 
                status: ActionStatus.ERROR,
                thing
            }))
    }
}

export function closeAck(thing) {
    return dispatch => {
        dispatch({
            type: ThingCommandActionsTypes.CLOSE_ACK, 
            status: ActionStatus.START,
            thing
        })
        return ResourceUtil.post(`/api/things/${thing.id}/closeack`)
            .then(result => dispatch({
                type: ThingCommandActionsTypes.CLOSE_ACK, 
                status: ActionStatus.COMPLETE,
                thing
            }))
            .catch(() => dispatch({
                type: ThingCommandActionsTypes.CLOSE_ACK, 
                status: ActionStatus.ERROR,
                thing
            }))
    }
}

export function close(thing, messageText) {
    return dispatch => {
        analytics.close()

        dispatch({
            type: ThingCommandActionsTypes.CLOSE, 
            status: ActionStatus.START,
            thing,
            messageText
        })
        return ResourceUtil.post(`/api/things/${thing.type.key}/${thing.id}/close`, {
                messageText: messageText
            })
            .then(result => dispatch({
                type: ThingCommandActionsTypes.CLOSE, 
                status: ActionStatus.COMPLETE,
                thing,
                messageText
            }))
            .catch(() => dispatch({
                type: ThingCommandActionsTypes.CLOSE, 
                status: ActionStatus.ERROR,
                thing,
                messageText
            }))
    }
}

export function dismiss(thing, messageText) {
    return dispatch => {
        analytics.dismiss()

        dispatch({
            type: ThingCommandActionsTypes.DISMISS, 
            status: ActionStatus.START,
            thing,
            messageText
        })
        return ResourceUtil.post(`/api/things/${thing.type.key}/${thing.id}/dismiss`, {
                messageText: messageText
            })
            .then(result => dispatch({
                type: ThingCommandActionsTypes.DISMISS, 
                status: ActionStatus.COMPLETE,
                thing,
                messageText
            }))
            .catch(() => dispatch({
                type: ThingCommandActionsTypes.DISMISS, 
                status: ActionStatus.ERROR,
                thing,
                messageText
            }))
    }
}

export function markAsDone(thing, messageText) {
    return dispatch => {
        analytics.done()

        dispatch({
            type: ThingCommandActionsTypes.MARK_AS_DONE, 
            status: ActionStatus.START,
            thing,
            messageText
        })
        return ResourceUtil.post(`/api/things/${thing.id}/done`, {
                messageText: messageText
            })
            .then(result => dispatch({
                type: ThingCommandActionsTypes.MARK_AS_DONE, 
                status: ActionStatus.COMPLETE,
                thing,
                messageText
            }))
            .catch(() => dispatch({
                type: ThingCommandActionsTypes.MARK_AS_DONE, 
                status: ActionStatus.ERROR,
                thing,
                messageText
            }))
    }
}

export function discardComments(notification) {
    return dispatch => {
        analytics.discard()

        dispatch({
            type: ThingCommandActionsTypes.DISCARD_COMMENTS, 
            status: ActionStatus.START,
            notification
        })
        return ResourceUtil.post(`/api/things/${notification.thing.id}/discard/${EventTypes.COMMENT.key}`)
            .then(result => dispatch({
                type: ThingCommandActionsTypes.DISCARD_COMMENTS, 
                status: ActionStatus.COMPLETE,
                notification
            }))
            .catch(() => dispatch({
                type: ThingCommandActionsTypes.DISCARD_COMMENTS, 
                status: ActionStatus.ERROR,
                notification
            }))
    }
}

export function discardSingleNotification(notification) {
    return dispatch => {
        analytics.discard()

        dispatch({
            type: ThingCommandActionsTypes.DISCARD_SINGLE_NOTIFICATION, 
            status: ActionStatus.START,
            notification
        })
        return ResourceUtil.post(`/api/events/${notification.id}/discard`)
            .then(result => dispatch({
                type: ThingCommandActionsTypes.DISCARD_SINGLE_NOTIFICATION, 
                status: ActionStatus.COMPLETE,
                notification
            }))
            .catch(() => dispatch({
                type: ThingCommandActionsTypes.DISCARD_SINGLE_NOTIFICATION, 
                status: ActionStatus.ERROR,
                notification
            }))
    }
}

export function joinMention(thing) {
    return dispatch => {
        analytics.join()

        dispatch({
            type: ThingCommandActionsTypes.JOIN_MENTION, 
            status: ActionStatus.START,
            thing
        })
        return ResourceUtil.post(`/api/things/${thing.id}/joinmention`)
            .then(result => dispatch({
                type: ThingCommandActionsTypes.JOIN_MENTION, 
                status: ActionStatus.COMPLETE,
                thing: result
            }))
            .catch(() => dispatch({
                type: ThingCommandActionsTypes.JOIN_MENTION, 
                status: ActionStatus.ERROR,
                thing
            }))
    }
}

export function leaveMention(thing) {
    return dispatch => {
        analytics.leave()

        dispatch({
            type: ThingCommandActionsTypes.LEAVE_MENTION, 
            status: ActionStatus.START,
            thing
        })
        return ResourceUtil.post(`/api/things/${thing.id}/leavemention`)
            .then(result => dispatch({
                type: ThingCommandActionsTypes.LEAVE_MENTION, 
                status: ActionStatus.COMPLETE,
                thing: result
            }))
            .catch(() => dispatch({
                type: ThingCommandActionsTypes.LEAVE_MENTION, 
                status: ActionStatus.ERROR,
                thing
            }))
    }
}

export function sendBack(thing, messageText) {
    return dispatch => {
        analytics.sendback()

        dispatch({
            type: ThingCommandActionsTypes.SEND_BACK, 
            status: ActionStatus.START,
            thing,
            messageText
        })
        return ResourceUtil.post(`/api/things/${thing.id}/sendback`, {
                messageText: messageText
            })
            .then(result => dispatch({
                type: ThingCommandActionsTypes.SEND_BACK, 
                status: ActionStatus.COMPLETE,
                thing,
                messageText
            }))
            .catch(() => dispatch({
                type: ThingCommandActionsTypes.SEND_BACK, 
                status: ActionStatus.ERROR,
                thing,
                messageText
            }))
    }
}

export function followUp(thing) {
    return dispatch => {
        analytics.followup()

        dispatch({
            type: ThingCommandActionsTypes.FOLLOW_UP, 
            status: ActionStatus.START,
            thing
        })
        return ResourceUtil.post(`/api/things/${thing.id}/followup`)
            .then(result => dispatch({
                type: ThingCommandActionsTypes.FOLLOW_UP, 
                status: ActionStatus.COMPLETE,
                thing
            }))
            .catch(() => dispatch({
                type: ThingCommandActionsTypes.FOLLOW_UP, 
                status: ActionStatus.ERROR,
                thing
            }))
    }
}

export function unfollow(thing) {
    return dispatch => {
        analytics.unfollow()

        dispatch({
            type: ThingCommandActionsTypes.UNFOLLOW, 
            status: ActionStatus.START,
            thing
        })
        return ResourceUtil.post(`/api/things/${thing.id}/unfollow`)
            .then(result => dispatch({
                type: ThingCommandActionsTypes.UNFOLLOW, 
                status: ActionStatus.COMPLETE,
                thing
            }))
            .catch(() => dispatch({
                type: ThingCommandActionsTypes.UNFOLLOW, 
                status: ActionStatus.ERROR,
                thing
            }))
    }
}

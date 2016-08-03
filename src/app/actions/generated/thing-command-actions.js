const ThingCommandActionsTypes = require('../types/thing-command-action-types')
const {ActionStatus} = require('../../constants')
const ResourceUtil = require('../../util/resource-util')
const EventTypes = require('../../../common/enums/event-types')

function comment(thingId, commentText) {
    return dispatch => {
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
                comment: result
            }))
            .catch(() => dispatch({
                type: ThingCommandActionsTypes.COMMENT, 
                status: ActionStatus.ERROR,
                thingId,
                commentText
            }))
    }
}

function newThing(thing) {
    return dispatch => {
        dispatch({
            type: ThingCommandActionsTypes.NEW_THING, 
            status: ActionStatus.START,
            thing
        })
        return ResourceUtil.post(`/api/new`, {
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

function ping(thing) {
    return dispatch => {
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
                pingEvent: result
            }))
            .catch(() => dispatch({
                type: ThingCommandActionsTypes.PING, 
                status: ActionStatus.ERROR,
                thing
            }))
    }
}

function markCommentAsRead(comment) {
    return dispatch => {
        dispatch({
            type: ThingCommandActionsTypes.MARK_COMMENT_AS_READ, 
            status: ActionStatus.START,
            comment
        })
        return ResourceUtil.post(`/api/events/${comment.id}/markasread`)
            .then(result => dispatch({
                type: ThingCommandActionsTypes.MARK_COMMENT_AS_READ, 
                status: ActionStatus.COMPLETE,
                comment
            }))
            .catch(() => dispatch({
                type: ThingCommandActionsTypes.MARK_COMMENT_AS_READ, 
                status: ActionStatus.ERROR,
                comment
            }))
    }
}

function doThing(thing) {
    return dispatch => {
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

function cancel(thing) {
    return dispatch => {
        dispatch({
            type: ThingCommandActionsTypes.CANCEL, 
            status: ActionStatus.START,
            thing
        })
        return ResourceUtil.post(`/api/things/${thing.id}/cancel`)
            .then(result => dispatch({
                type: ThingCommandActionsTypes.CANCEL, 
                status: ActionStatus.COMPLETE,
                thing
            }))
            .catch(() => dispatch({
                type: ThingCommandActionsTypes.CANCEL, 
                status: ActionStatus.ERROR,
                thing
            }))
    }
}

function cancelAck(thing) {
    return dispatch => {
        dispatch({
            type: ThingCommandActionsTypes.CANCEL_ACK, 
            status: ActionStatus.START,
            thing
        })
        return ResourceUtil.post(`/api/things/${thing.id}/cancelack`)
            .then(result => dispatch({
                type: ThingCommandActionsTypes.CANCEL_ACK, 
                status: ActionStatus.COMPLETE,
                thing
            }))
            .catch(() => dispatch({
                type: ThingCommandActionsTypes.CANCEL_ACK, 
                status: ActionStatus.ERROR,
                thing
            }))
    }
}

function close(thing) {
    return dispatch => {
        dispatch({
            type: ThingCommandActionsTypes.CLOSE, 
            status: ActionStatus.START,
            thing
        })
        return ResourceUtil.post(`/api/things/${thing.type.key}/${thing.id}/close`)
            .then(result => dispatch({
                type: ThingCommandActionsTypes.CLOSE, 
                status: ActionStatus.COMPLETE,
                thing
            }))
            .catch(() => dispatch({
                type: ThingCommandActionsTypes.CLOSE, 
                status: ActionStatus.ERROR,
                thing
            }))
    }
}

function dismiss(thing) {
    return dispatch => {
        dispatch({
            type: ThingCommandActionsTypes.DISMISS, 
            status: ActionStatus.START,
            thing
        })
        return ResourceUtil.post(`/api/things/${thing.type.key}/${thing.id}/dismiss`)
            .then(result => dispatch({
                type: ThingCommandActionsTypes.DISMISS, 
                status: ActionStatus.COMPLETE,
                thing
            }))
            .catch(() => dispatch({
                type: ThingCommandActionsTypes.DISMISS, 
                status: ActionStatus.ERROR,
                thing
            }))
    }
}

function markAsDone(thing) {
    return dispatch => {
        dispatch({
            type: ThingCommandActionsTypes.MARK_AS_DONE, 
            status: ActionStatus.START,
            thing
        })
        return ResourceUtil.post(`/api/things/${thing.id}/done`)
            .then(result => dispatch({
                type: ThingCommandActionsTypes.MARK_AS_DONE, 
                status: ActionStatus.COMPLETE,
                thing
            }))
            .catch(() => dispatch({
                type: ThingCommandActionsTypes.MARK_AS_DONE, 
                status: ActionStatus.ERROR,
                thing
            }))
    }
}

function discardComments(notification) {
    return dispatch => {
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

function discardPing(notification) {
    return dispatch => {
        dispatch({
            type: ThingCommandActionsTypes.DISCARD_PING, 
            status: ActionStatus.START,
            notification
        })
        return ResourceUtil.post(`/api/events/${notification.id}/discard`)
            .then(result => dispatch({
                type: ThingCommandActionsTypes.DISCARD_PING, 
                status: ActionStatus.COMPLETE,
                notification
            }))
            .catch(() => dispatch({
                type: ThingCommandActionsTypes.DISCARD_PING, 
                status: ActionStatus.ERROR,
                notification
            }))
    }
}

function sendBack(thing) {
    return dispatch => {
        dispatch({
            type: ThingCommandActionsTypes.SEND_BACK, 
            status: ActionStatus.START,
            thing
        })
        return ResourceUtil.post(`/api/things/${thing.id}/sendback`)
            .then(result => dispatch({
                type: ThingCommandActionsTypes.SEND_BACK, 
                status: ActionStatus.COMPLETE,
                thing
            }))
            .catch(() => dispatch({
                type: ThingCommandActionsTypes.SEND_BACK, 
                status: ActionStatus.ERROR,
                thing
            }))
    }
}

module.exports = {
    comment,
    newThing,
    ping,
    markCommentAsRead,
    doThing,
    cancel,
    cancelAck,
    close,
    dismiss,
    markAsDone,
    discardComments,
    discardPing,
    sendBack
}
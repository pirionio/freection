const ThingCommandActionsTypes = require('../types/thing-command-action-types')
const {ActionStatus} = require('../../constants')
const ResourceUtil = require('../../util/resource-util')

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
        return ResourceUtil.post(`/api/things/${comment.id}/markcommentasread`)
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
        return ResourceUtil.post(`/api/things/${thing.id}/do`)
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

function abort(thing) {
    return dispatch => {
        dispatch({
            type: ThingCommandActionsTypes.ABORT, 
            status: ActionStatus.START,
            thing
        })
        return ResourceUtil.post(`/api/things/${thing.id}/abort`)
            .then(result => dispatch({
                type: ThingCommandActionsTypes.ABORT, 
                status: ActionStatus.COMPLETE,
                thing
            }))
            .catch(() => dispatch({
                type: ThingCommandActionsTypes.ABORT, 
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
        return ResourceUtil.post(`/api/things/${thing.id}/close`)
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
        return ResourceUtil.post(`/api/things/${thing.id}/dismiss`)
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

module.exports = {
    comment,
    newThing,
    ping,
    markCommentAsRead,
    doThing,
    abort,
    close,
    dismiss,
    markAsDone
}
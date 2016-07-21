const ThingActionTypes = require('./types/thing-action-types')
const ThingService = require('../services/thing-service')
const {ActionStatus} = require('../constants')

function markCommentAsReadRequest(comment) {
    return {
        type: ThingActionTypes.MARK_COMMENT_AS_READ,
        status: ActionStatus.START,
        comment
    }
}

function markCommentAsReadRequestComplete(comment) {
    return {
        type: ThingActionTypes.MARK_COMMENT_AS_READ,
        status: ActionStatus.COMPLETE,
        comment
    }
}

function markCommentAsReadRequestFailed(comment) {
    return {
        type: ThingActionTypes.MARK_COMMENT_AS_READ,
        status: ActionStatus.ERROR,
        comment
    }
}

const markCommentAsRead = (comment) => {
    return dispatch => {
        dispatch(markCommentAsReadRequest(comment))
        ThingService.markCommentAsRead(comment).
        then(() => dispatch(markCommentAsReadRequestComplete(comment))).
        catch(() => dispatch(markCommentAsReadRequestFailed(comment)))
    }
}

module.exports = {markCommentAsRead}
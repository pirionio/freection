const {actions} = require('react-redux-form')

const ThingActionTypes = require('./types/thing-action-types')
const {ActionStatus} = require('../constants')
const ThingService = require('../services/thing-service')

function createCommentRequest(thingId) {
    return {
        type: ThingActionTypes.CREATE_COMMENT,
        status: ActionStatus.START,
        thingId
    }
}

function createCommentRequestComplete(thingId, comment) {
    return {
        type: ThingActionTypes.CREATE_COMMENT,
        status: ActionStatus.COMPLETE,
        thingId,
        comment
    }
}

function createCommentRequestFailed(thingId) {
    return {
        type: ThingActionTypes.CREATE_COMMENT,
        status: ActionStatus.ERROR,
        thingId
    }
}

function createNewThing(thing) {
    return dispatch => {
        var promise = ThingService.createNewThing({
            to: thing.to,
            body: thing.body,
            subject: thing.subject
        })
        dispatch(actions.submit('messageBox', promise)).then(() => dispatch(actions.reset('messageBox')))
    }
}

function createComment(thingId, commentText) {
    return dispatch => {
        var promise = ThingService.createComment(thingId, commentText)
            .then(comment => dispatch(createCommentRequestComplete(thingId, comment)))
            .catch(error => dispatch(createCommentRequestFailed(thingId)))

        // This action takes care of the state of the message box itself.
        dispatch(actions.submit('messageBox', promise)).then(() => dispatch(actions.reset('messageBox')))

        // This action takes care of collateral effect of adding a comment (like showing it in the right context).
        dispatch(createCommentRequest(thingId))
    }
}

const newCommentReceived = (comment) => {
    return {
        type: ThingActionTypes.NEW_COMMENT_RECEIVED,
        comment
    }
}

const thingCreatedReceived = (thing) => {
    return {
        type: ThingActionTypes.CREATED_RECEIVED,
        thing
    }
}

const thingAcceptedReceived = (thing) => {
    return {
        type: ThingActionTypes.ACCEPTED_RECEIVED,
        thing
    }
}

const thingDoneReceived = (thing) => {
    return {
        type: ThingActionTypes.DONE_RECEIVED,
        thing
    }
}

const commentReadByReceived = (comment) => {
    return {
        type: ThingActionTypes.COMMENT_READ_BY_RECEIVED,
        comment
    }
}

module.exports = {createNewThing, createComment, newCommentReceived,
    thingCreatedReceived, thingAcceptedReceived, thingDoneReceived, commentReadByReceived}
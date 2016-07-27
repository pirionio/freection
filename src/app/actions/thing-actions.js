const {actions} = require('react-redux-form')

const ThingActionTypes = require('./types/thing-action-types')
const {ActionStatus} = require('../constants')
const ThingService = require('../services/thing-service')

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

const thingClosedReceived = (thing) => {
    return {
        type: ThingActionTypes.CLOSED_RECEIVED,
        thing
    }
}

const thingAbortedReceived = (thing) => {
    return {
        type: ThingActionTypes.ABORTED_RECEIVED,
        thing
    }
}

const commentReadByReceived = (comment) => {
    return {
        type: ThingActionTypes.COMMENT_READ_BY_RECEIVED,
        comment
    }
}

const thingDimissedReceived = (thing) => {
    return {
        type: ThingActionTypes.DISMISSED_RECEIVED,
        thing
    }
}

const thingPingReceived = (pingEvent) => {
    return {
        type: ThingActionTypes.PING_RECEIVED,
        pingEvent
    }
}

module.exports = {newCommentReceived,
    thingCreatedReceived, thingAcceptedReceived, thingDoneReceived, thingClosedReceived,
    commentReadByReceived, thingDimissedReceived, thingAbortedReceived, thingPingReceived}
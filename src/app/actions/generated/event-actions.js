const EventActionsTypes = require('../types/event-action-types')
const {ActionStatus} = require('../../constants')
const ResourceUtil = require('../../util/resource-util')

function created(event) {
    return {
        type: EventActionsTypes.CREATED,
        event
    }
}

function accepted(event) {
    return {
        type: EventActionsTypes.ACCEPTED,
        event
    }
}

function markedAsDone(event) {
    return {
        type: EventActionsTypes.MARKED_AS_DONE,
        event
    }
}

function closed(event) {
    return {
        type: EventActionsTypes.CLOSED,
        event
    }
}

function closeAcked(event) {
    return {
        type: EventActionsTypes.CLOSE_ACKED,
        event
    }
}

function dismissed(event) {
    return {
        type: EventActionsTypes.DISMISSED,
        event
    }
}

function sentBack(event) {
    return {
        type: EventActionsTypes.SENT_BACK,
        event
    }
}

function pinged(event) {
    return {
        type: EventActionsTypes.PINGED,
        event
    }
}

function ponged(event) {
    return {
        type: EventActionsTypes.PONGED,
        event
    }
}

function commentCreated(event) {
    return {
        type: EventActionsTypes.COMMENT_CREATED,
        event
    }
}

function commentReadBy(event) {
    return {
        type: EventActionsTypes.COMMENT_READ_BY,
        event
    }
}

function reconnected() {
    return {
        type: EventActionsTypes.RECONNECTED        
    }
}

module.exports = {
    created,
    accepted,
    markedAsDone,
    closed,
    closeAcked,
    dismissed,
    sentBack,
    pinged,
    ponged,
    commentCreated,
    commentReadBy,
    reconnected
}
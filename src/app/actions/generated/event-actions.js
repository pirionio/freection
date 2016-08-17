const EventActionsTypes = require('../types/event-action-types')
const {ActionStatus} = require('../../constants')
const ResourceUtil = require('../../util/resource-util')

function created(thing) {
    return {
        type: EventActionsTypes.CREATED,
        thing
    }
}

function accepted(thing) {
    return {
        type: EventActionsTypes.ACCEPTED,
        thing
    }
}

function markedAsDone(thing) {
    return {
        type: EventActionsTypes.MARKED_AS_DONE,
        thing
    }
}

function closed(thing) {
    return {
        type: EventActionsTypes.CLOSED,
        thing
    }
}

function cancelAcked(thing) {
    return {
        type: EventActionsTypes.CANCEL_ACKED,
        thing
    }
}

function dismissed(thing) {
    return {
        type: EventActionsTypes.DISMISSED,
        thing
    }
}

function sentBack(thing) {
    return {
        type: EventActionsTypes.SENT_BACK,
        thing
    }
}

function pinged(pingEvent) {
    return {
        type: EventActionsTypes.PINGED,
        pingEvent
    }
}

function ponged(pongEvent) {
    return {
        type: EventActionsTypes.PONGED,
        pongEvent
    }
}

function commentCreated(comment) {
    return {
        type: EventActionsTypes.COMMENT_CREATED,
        comment
    }
}

function commentReadBy(comment) {
    return {
        type: EventActionsTypes.COMMENT_READ_BY,
        comment
    }
}

module.exports = {
    created,
    accepted,
    markedAsDone,
    closed,
    cancelAcked,
    dismissed,
    sentBack,
    pinged,
    ponged,
    commentCreated,
    commentReadBy
}
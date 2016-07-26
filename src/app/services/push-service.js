const SocketUtil = require('../util/socket-util')

const WhatsNewActions = require('../actions/whats-new-actions')
const ThingActions = require('../actions/thing-actions')
const EventTypes = require('../../common/enums/event-types')

function listenToUpdates(pushToken, dispatch) {
    const socket = SocketUtil.createSocket(pushToken)
    
    socket.on('new-event', event => {
        if (event.showNew)
            dispatch(WhatsNewActions.notificationReceived(event))

        if (event.eventType.key === EventTypes.COMMENT.key)
            dispatch(ThingActions.newCommentReceived(event))

        if (event.eventType.key === EventTypes.CREATED.key)
            dispatch(ThingActions.thingCreatedReceived(event.thing))

        if (event.eventType.key === EventTypes.ACCEPTED.key)
            dispatch(ThingActions.thingAcceptedReceived(event.thing))

        if (event.eventType.key === EventTypes.DONE.key)
            dispatch(ThingActions.thingDoneReceived(event.thing))

        if (event.eventType.key === EventTypes.CLOSED.key)
            dispatch(ThingActions.thingClosedReceived(event.thing))

        if (event.eventType.key === EventTypes.DISMISSED.key)
            dispatch(ThingActions.thingDimissedReceived(event.thing))

        if (event.eventType.key === EventTypes.ABORTED.key)
            dispatch(ThingActions.thingAbortedReceived(event.thing))
    })

    socket.on('notification-deleted', event => {
        dispatch(WhatsNewActions.notificationDeleted(event))
    })

    socket.on('comment-read-by', event => {
        dispatch(ThingActions.commentReadByReceived(event))
    })
}

module.exports = {listenToUpdates}
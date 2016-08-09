const SocketUtil = require('../util/socket-util')

const WhatsNewActions = require('../actions/whats-new-actions')
const EventActions = require('../actions/event-actions')
const EventTypes = require('../../common/enums/event-types')

const EmailLifecycleService = require('./email-lifecycle-service')

function listenToUpdates(pushToken, dispatch) {
    const socket = SocketUtil.createSocket(pushToken)
    
    socket.on('new-event', event => {
        if (event.showNew)
            dispatch(WhatsNewActions.notificationReceived(event))

        if (event.eventType.key === EventTypes.COMMENT.key)
            dispatch(EventActions.commentCreated(event))

        if (event.eventType.key === EventTypes.CREATED.key)
            dispatch(EventActions.created(event.thing))

        if (event.eventType.key === EventTypes.ACCEPTED.key)
            dispatch(EventActions.accepted(event.thing))

        if (event.eventType.key === EventTypes.DONE.key)
            dispatch(EventActions.markedAsDone(event.thing))

        if (event.eventType.key === EventTypes.CLOSED.key)
            dispatch(EventActions.closed(event.thing))

        if (event.eventType.key === EventTypes.DISMISSED.key)
            dispatch(EventActions.dismissed(event.thing))

        if (event.eventType.key === EventTypes.CANCELED.key)
            dispatch(EventActions.canceled(event.thing))

        if (event.eventType.key === EventTypes.SENT_BACK.key)
            dispatch(EventActions.sentBack(event.thing))

        if (event.eventType.key === EventTypes.CANCEL_ACKED.key) {
            dispatch(EventActions.cancelAcked(event.thing))
        }

        if (event.eventType.key === EventTypes.PING.key)
            dispatch(EventActions.pinged(event))
    })

    socket.on('notification-deleted', event => {
        dispatch(WhatsNewActions.notificationDeleted(event))
    })

    socket.on('comment-read-by', event => {
        dispatch(EventActions.commentReadBy(event))
    })

    socket.on('email-notification', () => {
        EmailLifecycleService.updateUnread()
    })
}

module.exports = {listenToUpdates}
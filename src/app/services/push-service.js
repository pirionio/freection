const SocketUtil = require('../util/socket-util')

const WhatsNewActions = require('../actions/whats-new-actions')
const ToDoActions = require('../actions/to-do-actions')
const FollowUpActions = require('../actions/follow-up-actions')
const EventActions = require('../actions/event-actions')
const EmailPageActions = require('../actions/email-page-actions')
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
            dispatch(EventActions.created(event))

        if (event.eventType.key === EventTypes.ACCEPTED.key)
            dispatch(EventActions.accepted(event.thing))

        if (event.eventType.key === EventTypes.DONE.key)
            dispatch(EventActions.markedAsDone(event.thing))

        if (event.eventType.key === EventTypes.CLOSED.key)
            dispatch(EventActions.closed(event.thing))

        if (event.eventType.key === EventTypes.DISMISSED.key)
            dispatch(EventActions.dismissed(event.thing))

        if (event.eventType.key === EventTypes.SENT_BACK.key)
            dispatch(EventActions.sentBack(event.thing))

        if (event.eventType.key === EventTypes.CLOSE_ACKED.key)
            dispatch(EventActions.closeAcked(event.thing))

        if (event.eventType.key === EventTypes.PING.key)
            dispatch(EventActions.pinged(event))

        if (event.eventType.key === EventTypes.PONG.key)
            dispatch(EventActions.ponged(event))
    })

    socket.on('notification-deleted', event => {
        dispatch(WhatsNewActions.notificationDeleted(event))
    })

    socket.on('comment-read-by', event => {
        dispatch(EventActions.commentReadBy(event))
    })

    socket.on('email-notification', () => {
        dispatch(EmailPageActions.requireUpdate())
        EmailLifecycleService.updateUnread()
    })

    socket.on('reconnect', () => {
        EmailLifecycleService.reconnected()

        // This will make the invalidation status of all pages to be REQUIRE_UPDATE
        dispatch(EventActions.reconnected())

        // Only active page will actually get updated, let's manually call all fetch methods
        dispatch(WhatsNewActions.fetchWhatsNew())
        dispatch(ToDoActions.fetchToDo())
        dispatch(FollowUpActions.fetchFollowUps())
    })
}

module.exports = {listenToUpdates}
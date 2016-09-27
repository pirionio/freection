import {createSocket} from '../util/socket-util'
import * as WhatsNewActions from '../actions/whats-new-actions'
import * as ToDoActions from '../actions/to-do-actions'
import * as  FollowUpActions from '../actions/follow-up-actions'
import * as EventActions from '../actions/event-actions'
import EventTypes from '../../common/enums/event-types'
// import EmailLifecycleService from './email-lifecycle-service'
// import * as EmailPageActions from '../actions/email-page-actions'

export function listenToUpdates(pushToken, dispatch) {
    const socket = createSocket(pushToken)
    
    socket.on('new-event', event => {
        if (event.showNew)
            dispatch(WhatsNewActions.notificationReceived(event))

        if (event.eventType.key === EventTypes.COMMENT.key)
            dispatch(EventActions.commentCreated(event))

        if (event.eventType.key === EventTypes.CREATED.key)
            dispatch(EventActions.created(event))

        if (event.eventType.key === EventTypes.ACCEPTED.key)
            dispatch(EventActions.accepted(event))

        if (event.eventType.key === EventTypes.DONE.key)
            dispatch(EventActions.markedAsDone(event))

        if (event.eventType.key === EventTypes.CLOSED.key)
            dispatch(EventActions.closed(event))

        if (event.eventType.key === EventTypes.DISMISSED.key)
            dispatch(EventActions.dismissed(event))

        if (event.eventType.key === EventTypes.SENT_BACK.key)
            dispatch(EventActions.sentBack(event))

        if (event.eventType.key === EventTypes.CLOSE_ACKED.key)
            dispatch(EventActions.closeAcked(event))

        if (event.eventType.key === EventTypes.PING.key)
            dispatch(EventActions.pinged(event))

        if (event.eventType.key === EventTypes.PONG.key)
            dispatch(EventActions.ponged(event))
        
        if (event.eventType.key === EventTypes.MENTIONED.key)
            dispatch(EventActions.mentioned(event))
    })

    socket.on('notification-deleted', event => {
        dispatch(WhatsNewActions.notificationDeleted(event))
    })

    socket.on('comment-read-by', event => {
        dispatch(EventActions.commentReadBy(event))
    })

    socket.on('email-notification', () => {
        // dispatch(EmailPageActions.requireUpdate())
        // EmailLifecycleService.updateUnread()
    })

    socket.on('reconnect', () => {
        // EmailLifecycleService.reconnected()

        // This will make the invalidation status of all pages to be REQUIRE_UPDATE
        dispatch(EventActions.reconnected())

        // Only active page will actually get updated, let's manually call all fetch methods
        dispatch(WhatsNewActions.fetchWhatsNew())
        dispatch(ToDoActions.fetchToDo())
        dispatch(FollowUpActions.fetchFollowUps())
    })
}
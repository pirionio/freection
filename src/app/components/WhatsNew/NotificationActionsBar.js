import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import EventTypes from '../../../common/enums/event-types'
import ThingStatus from '../../../common/enums/thing-status'
import ActionsBar from '../Actions/ActionsBar'
import {DoAction, DoneAction, DismissAction, CloseAction, SendBackAction, DiscardCommentsAction, DiscardNotificationAction, CloseAckAction,
    PongAction, JoinMention, FollowUpAction, UnfollowAction} from '../Actions/Actions'

class NotificationActionsBar extends Component {
    showDo() {
        const {notification} = this.props
        return [EventTypes.CREATED.key, EventTypes.SENT_BACK.key].includes(notification.eventType.key)
    }

    showDone() {
        const {notification} = this.props
        return [EventTypes.CREATED.key, EventTypes.SENT_BACK.key].includes(notification.eventType.key)
    }

    showDismiss() {
        const {notification} = this.props
        return [EventTypes.CREATED.key, EventTypes.SENT_BACK.key].includes(notification.eventType.key)
    }

    showClose() {
        const {notification} = this.props
        return [EventTypes.CREATED.key, EventTypes.DONE.key, EventTypes.DISMISSED.key].includes(notification.eventType.key)
    }
    
    showPong() {
        const {notification} = this.props
        return [EventTypes.PING.key].includes(notification.eventType.key)
    }

    showCloseAck() {
        const {notification} = this.props
        return notification.thing.isDoer
    }

    showJoin() {
        const {notification} = this.props
        return [EventTypes.MENTIONED.key, EventTypes.SENT_BACK.key].includes(notification.eventType.key)
    }

    showFollowUp() {
        const {notification} = this.props
        return [EventTypes.MENTIONED.key, EventTypes.SENT_BACK.key].includes(notification.eventType.key)
    }

    showUnfollow() {
        const {notification} = this.props
        return [EventTypes.DONE.key, EventTypes.DISMISSED.key, EventTypes.CLOSED.key].includes(notification.eventType.key)
    }

    getUnfollowLabel() {
        const {notification} = this.props

        if ([ThingStatus.DONE.key, ThingStatus.DISMISS.key, ThingStatus.CLOSE.key].includes(notification.thing.payload.status)) {
            return 'Close'
        } else {
            return 'Unfollow'
        }
    }

    showDiscardSentBack() {
        const {notification} = this.props
        return notification.thing.isMentioned
    }

    showDiscardClosed() {
        const {notification} = this.props
        return notification.thing.isSubscriber
    }

    showDiscardDoneOrDismissed() {
        const {notification} = this.props
        return notification.thing.isSubscriber ||
            (notification.thing.isFollowUper &&
            [ThingStatus.NEW.key, ThingStatus.INPROGRESS.key, ThingStatus.REOPENED.key].includes(notification.thing.payload.status))
    }

    render() {
        const {notification, currentUser, preDoFunc} = this.props

        const doAction = DoAction(notification.thing, currentUser)
        doAction.show = doAction.show && this.showDo()

        const doneAction = DoneAction(notification.thing, currentUser, {preDoFunc})
        doneAction.show = doneAction.show && this.showDone()

        const dismissAction = DismissAction(notification.thing, currentUser, {preDoFunc})
        dismissAction.show = dismissAction.show && this.showDismiss()

        const closeAction = CloseAction(notification.thing, currentUser)
        closeAction.show = closeAction.show && this.showClose()

        const pongAction = PongAction(notification.thing, currentUser, {preDoFunc})
        pongAction.show = pongAction.show && this.showPong()

        const closeAckAction = CloseAckAction(notification)
        closeAckAction.show = closeAckAction.show && this.showCloseAck()

        const joinMention = JoinMention(notification.thing)
        joinMention.show = joinMention.show && this.showJoin()

        const followUpAction = FollowUpAction(notification.thing)
        followUpAction.show = followUpAction.show && this.showFollowUp()

        const unfollowAction = UnfollowAction(notification.thing, this.getUnfollowLabel())
        unfollowAction.show = unfollowAction.show && this.showUnfollow()

        const discardSentBackAction = DiscardNotificationAction(notification, EventTypes.SENT_BACK)
        discardSentBackAction.show = discardSentBackAction.show && this.showDiscardSentBack()

        const discardClosedAction = DiscardNotificationAction(notification, EventTypes.CLOSED, 'Close')
        discardClosedAction.show = discardClosedAction.show && this.showDiscardClosed()

        const discardDoneAction = DiscardNotificationAction(notification, EventTypes.DONE)
        discardDoneAction.show = discardDoneAction.show && this.showDiscardDoneOrDismissed()

        const discardDismissedAction = DiscardNotificationAction(notification, EventTypes.DISMISSED)
        discardDismissedAction.show = discardDismissedAction.show && this.showDiscardDoneOrDismissed()

        const actions = [
            doAction,
            doneAction,
            dismissAction,
            closeAction,
            pongAction,
            closeAckAction,
            SendBackAction(notification.thing, currentUser, {preDoFunc}),
            discardDoneAction,
            discardDismissedAction,
            followUpAction,
            unfollowAction,
            joinMention,
            discardSentBackAction,
            discardClosedAction,
            DiscardCommentsAction(notification),
            DiscardNotificationAction(notification, EventTypes.PING),
            DiscardNotificationAction(notification, EventTypes.PONG),
            DiscardNotificationAction(notification, EventTypes.MENTIONED)
        ]

        return (
            <div>
                <ActionsBar actions={actions} />
            </div>
        )
    }
}

NotificationActionsBar.propTypes = {
    notification: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    preDoFunc: PropTypes.func
}

function mapStateToProps(state) {
    return {
        currentUser: state.auth
    }
}

export default connect(mapStateToProps)(NotificationActionsBar)
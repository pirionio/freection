import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import EventTypes from '../../../common/enums/event-types'
import ActionsBar from '../Actions/ActionsBar'
import {DoAction, DoneAction, DismissAction, CloseAction, SendBackAction, DiscardCommentsAction, DiscardPingAction,
    DiscardPongAction, CloseAckAction,
    PongAction} from '../Actions/Actions'

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

        const actions = [
            doAction,
            doneAction,
            dismissAction,
            closeAction,
            pongAction,
            SendBackAction(notification.thing, currentUser, {preDoFunc}),
            DiscardCommentsAction(notification),
            DiscardPingAction(notification),
            DiscardPongAction(notification),
            CloseAckAction(notification)
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
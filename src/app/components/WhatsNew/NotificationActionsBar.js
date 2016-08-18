const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')

const EventTypes = require('../../../common/enums/event-types')
const ActionsBar = require('../Actions/ActionsBar')
const {DoAction, DoneAction, DismissAction, CloseAction, SendBackAction, DiscardCommentsAction, DiscardPingAction,
    DiscardPongAction, CloseAckAction,
    PongAction} = require('../Actions/Actions')

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
        const {notification, currentUser, isRollover, preDoFunc} = this.props

        const doAction = DoAction(notification.thing, currentUser)
        doAction.show = doAction.show && this.showDo()

        const doneAction = DoneAction(notification.thing, currentUser, {preDoFunc})
        doneAction.show = doneAction.show && this.showDone()

        const dismissAction = DismissAction(notification.thing, currentUser, {preDoFunc})
        dismissAction.show = dismissAction.show && this.showDismiss()

        const closeAction = CloseAction(notification.thing, currentUser, {preDoFunc})
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
                <ActionsBar actions={actions} isRollover={isRollover} />
            </div>
        )
    }
}

NotificationActionsBar.propTypes = {
    notification: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    isRollover: PropTypes.bool,
    preDoFunc: PropTypes.func
}

function mapStateToProps(state) {
    return {
        currentUser: state.auth
    }
}

module.exports = connect(mapStateToProps)(NotificationActionsBar)
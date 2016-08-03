const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const includes = require('lodash/includes')

const EventTypes = require('../../../common/enums/event-types')
const {DoAction, DoneAction, DismissAction, CloseAction, SendBacAction, DiscardCommentsAction, DiscardPingAction, CancelAckAction} =
    require('./Actions')

class NotificationActionsBar extends Component {
    showDo() {
        const {notification, currentUser} = this.props
        return (notification ? includes([EventTypes.CREATED.key, EventTypes.SENT_BACK.key], notification.eventType.key) : true) &&
            DoAction.shouldShow(notification.thing, currentUser)
    }

    showDone() {
        const {notification, currentUser} = this.props
        return (notification ? includes([EventTypes.CREATED.key, EventTypes.SENT_BACK.key], notification.eventType.key) : true) &&
            DoneAction.shouldShow(notification.thing, currentUser)
    }

    showDismiss() {
        const {notification, currentUser} = this.props
        return (notification ? includes([EventTypes.CREATED.key, EventTypes.SENT_BACK.key], notification.eventType.key): true) &&
            DismissAction.shouldShow(notification.thing, currentUser)
    }

    showClose() {
        const {notification, currentUser} = this.props
        return (notification ? includes([EventTypes.DONE.key, EventTypes.DISMISSED.key], notification.eventType.key) : true) &&
            CloseAction.shouldShow(notification.thing, currentUser)
    }

    showSendBack() {
        const {notification, currentUser} = this.props
        return SendBacAction.shouldShow(notification.thing, currentUser)
    }

    showDiscardComments() {
        const {notification} = this.props
        return DiscardCommentsAction.shouldShow(notification)
    }

    showDiscardPing() {
        const {notification} = this.props
        return DiscardPingAction.shouldShow(notification)
    }

    showCancelAck() {
        const {notification} = this.props
        return CancelAckAction.shouldShow(notification)
    }

    getActions() {
        const {notification} = this.props

        const actions = []

        if (this.showDo())
            actions.push(DoAction.getComponent(notification.thing))

        if (this.showDone())
            actions.push(DoneAction.getComponent(notification.thing))

        if (this.showDismiss())
            actions.push(DismissAction.getComponent(notification.thing))

        if (this.showClose())
            actions.push(CloseAction.getComponent(notification.thing))

        if (this.showSendBack())
            actions.push(SendBacAction.getComponent(notification.thing))

        if (this.showDiscardComments())
            actions.push(DiscardCommentsAction.getComponent(notification))

        if (this.showDiscardPing())
            actions.push(DiscardPingAction.getComponent(notification))

        if (this.showCancelAck())
            actions.push(CancelAckAction.getComponent(notification.thing))

        return actions
    }

    render() {
        const actions = this.getActions()
        return (
            <div>
                {actions}
            </div>
        )
    }
}

NotificationActionsBar.propTypes = {
    notification: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        currentUser: state.auth
    }
}

module.exports = connect(mapStateToProps)(NotificationActionsBar)
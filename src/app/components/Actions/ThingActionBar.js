const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')

const includes = require('lodash/includes')

const BaseActionBar = require('./BaseActionsBar')
const EventTypes = require('../../../common/enums/event-types')
const ThingStatus = require('../../../common/enums/thing-status')

class ThingActionsBar extends Component {
    showDo() {
        const {thing, notification, currentUser} = this.props
        return currentUser.id === thing.to.id &&
            includes([ThingStatus.NEW.key, ThingStatus.REOPENED.key], thing.payload.status) &&
            (notification ? includes([EventTypes.CREATED.key, EventTypes.SENT_BACK.key], notification.eventType.key) : true)
    }

    showDone() {
        const {thing, notification, currentUser} = this.props
        return currentUser.id === thing.to.id &&
            includes([ThingStatus.NEW.key, ThingStatus.INPROGRESS.key, ThingStatus.REOPENED.key], thing.payload.status) &&
            (notification ? includes([EventTypes.CREATED.key, EventTypes.SENT_BACK.key], notification.eventType.key) : true)
    }

    showDismiss() {
        const {thing, notification, currentUser} = this.props
        return currentUser.id === thing.to.id &&
            includes([ThingStatus.NEW.key, ThingStatus.INPROGRESS.key, ThingStatus.REOPENED.key], thing.payload.status) &&
            (notification ? includes([EventTypes.CREATED.key, EventTypes.SENT_BACK.key], notification.eventType.key): true) &&
            !thing.isSelf
    }

    showClose() {
        const {thing, notification, currentUser} = this.props
        return currentUser.id === thing.creator.id &&
            includes([ThingStatus.DONE.key, ThingStatus.DISMISS.key], thing.payload.status) &&
            (notification ? includes([EventTypes.DONE.key, EventTypes.DISMISSED.key], notification.eventType.key) : true)
    }

    showCancel() {
        const {thing, currentUser, cancel} = this.props
        return currentUser.id === thing.creator.id &&
            includes([ThingStatus.NEW.key, ThingStatus.REOPENED.key, ThingStatus.INPROGRESS.key], thing.payload.status) &&
            cancel
    }

    showPing() {
        const {thing, currentUser, ping} = this.props
        return currentUser.id === thing.creator.id &&
            includes([ThingStatus.INPROGRESS.key], thing.payload.status) &&
            ping &&
            !thing.isSelf
    }

    showDiscardComments() {
        const {notification} = this.props
        return notification && notification.eventType.key === EventTypes.COMMENT.key
    }

    showDiscardPing() {
        const {notification} = this.props
        return notification && notification.eventType.key === EventTypes.PING.key
    }

    showSendBack() {
        const {thing, currentUser} = this.props
        return currentUser.id === thing.creator.id &&
            includes([ThingStatus.DONE.key, ThingStatus.DISMISS.key], thing.payload.status)
    }

    showCancelAck() {
        const {notification} = this.props
        return notification && notification.eventType.key === EventTypes.CANCELED.key
    }

    getAllowedActions() {
        return {
            doAction: this.showDo(),
            done: this.showDone(),
            dismiss: this.showDismiss(),
            cancel: this.showCancel(),
            ping: this.showPing(),
            close: this.showClose(),
            discardComments: this.showDiscardComments(),
            discardPing: this.showDiscardPing(),
            sendBack: this.showSendBack(),
            cancelAck: this.showCancelAck()
        }
    }

    render() {
        return (<BaseActionBar thing={this.props.thing} notification={this.props.notification}
                           allowedActions={this.getAllowedActions()} />)
    }
}

ThingActionsBar.propTypes = {
    currentUser: PropTypes.object.isRequired,
    thing: PropTypes.object.isRequired,
    notification: PropTypes.object,
    ping: PropTypes.bool,
    cancel: PropTypes.bool
}

ThingActionsBar.defaultProps = {
    ping: true,
    cancel: true
}

function mapStateToProps(state) {
    return {
        currentUser: state.auth
    }
}

module.exports = connect(mapStateToProps)(ThingActionsBar)
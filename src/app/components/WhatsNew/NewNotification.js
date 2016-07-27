const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')

const MessageRow = require('../Messages/MessageRow')
const Action = require('../Messages/Action')

const ThingCommandActions = require('../../actions/thing-command-actions')
const EventTypes = require('../../../common/enums/event-types')

class NewNotification extends Component {
    constructor(props) {
        super(props)
        this.doThing = this.doThing.bind(this)
        this.dismissThing = this.dismissThing.bind(this)
        this.markThingAsDone = this.markThingAsDone.bind(this)
        this.closeThing = this.closeThing.bind(this)
        this.discardComments = this.discardComments.bind(this)
        this.discardPing = this.discardPing.bind(this)
        this.doActionEnabled = this.doActionEnabled.bind(this)
    }

    doThing() {
        const {dispatch, notification} = this.props
        dispatch(ThingCommandActions.doThing(notification.thing))
    }

    dismissThing() {
        const {dispatch, notification} = this.props
        dispatch(ThingCommandActions.dismiss(notification.thing))
    }

    markThingAsDone() {
        const {dispatch, notification} = this.props
        dispatch(ThingCommandActions.markAsDone(notification.thing))
    }

    closeThing() {
        const {dispatch, notification} = this.props
        dispatch(ThingCommandActions.close(notification.thing))
    }

    discardComments() {
        const {dispatch, notification, currentUser} = this.props
        dispatch(ThingCommandActions.discardComments(notification, currentUser))
    }
    
    discardPing() {
        const {dispatch, notification} = this.props
        dispatch(ThingCommandActions.discardPing(notification))
    }

    doActionEnabled() {
        return this.props.notification.eventType.key === EventTypes.CREATED.key
    }

    dismissEnabled() {
        return this.props.notification.eventType.key === EventTypes.CREATED.key
    }

    doneActionEnabled() {
        return this.props.notification.eventType.key === EventTypes.CREATED.key
    }

    closeActionEnabled() {
        return this.props.notification.eventType.key === EventTypes.DONE.key
    }
    
    discardCommentsEnabled() {
        return this.props.notification.eventType.key === EventTypes.COMMENT.key
    }

    discardPingEnabled() {
        return this.props.notification.eventType.key === EventTypes.PING.key
    }

    getNotificationViewModel() {
        const {notification} = this.props
        return Object.assign({}, notification, {
            entityId: notification.thing.id,
            subject: notification.thing.subject
        })
    }

    getActions() {
        let actions = []

        if (this.doActionEnabled()) {
            actions.push(<Action label="Do" doFunc={this.doThing} key="action-Do" />)
        }
        if (this.dismissEnabled()) {
            actions.push(<Action label="Dismiss" doFunc={this.dismissThing} key="action-Dismiss" />)
        }
        if (this.doneActionEnabled()) {
            actions.push(<Action label="Done" doFunc={this.markThingAsDone} key="action-Done" />)
        }
        if (this.discardCommentsEnabled()) {
            actions.push(<Action label="Discard" doFunc={this.discardComments} key="action-Discard" />)
        }
        if (this.discardPingEnabled()) {
            actions.push(<Action label="Discard" doFunc={this.discardPing} key="action-Discard" />)
        }
        if (this.closeActionEnabled()) {
            actions.push(<Action label="Close" doFunc={this.closeThing} key="action-Close" />)
        }

        return actions
    }

    render () {
        const notification = this.getNotificationViewModel()
        const actions = this.getActions()

        return (
            <MessageRow message={notification}
                        currentUser={this.props.currentUser}
                        actions={actions}
                        context="/whatsnew" />
        )
    }
}

NewNotification.propTypes = {
    notification: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.auth
    }
}

module.exports = connect(mapStateToProps)(NewNotification)
const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')

const MessageRow = require('../Messages/MessageRow')
const Action = require('../Messages/Action')

const DoThingActions = require('../../actions/do-thing-actions')
const MarkThingDoneActions = require('../../actions/mark-thing-done-actions')
const CloseThingActions = require('../../actions/close-thing-actions')
const DiscardCommentsActions = require('../../actions/discard-comments-actions')
const EventTypes = require('../../../common/enums/event-types')

class NewNotification extends Component {
    constructor(props) {
        super(props)
        this.doThing = this.doThing.bind(this)
        this.markThingAsDone = this.markThingAsDone.bind(this)
        this.closeThing = this.closeThing.bind(this)
        this.discardComments = this.discardComments.bind(this)
        this.doActionEnabled = this.doActionEnabled.bind(this)
    }

    doThing() {
        const {dispatch, notification} = this.props
        dispatch(DoThingActions.doThing(notification))
    }

    markThingAsDone() {
        const {dispatch, notification} = this.props
        dispatch(MarkThingDoneActions.markThingAsDone(notification.thing))
    }

    closeThing() {
        const {dispatch, notification} = this.props
        dispatch(CloseThingActions.closeThing(notification))
    }

    discardComments() {
        const {dispatch, notification, currentUser} = this.props
        dispatch(DiscardCommentsActions.discardComments(notification, currentUser))
    }

    doActionEnabled() {
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
        if (this.doneActionEnabled()) {
            actions.push(<Action label="Done" doFunc={this.markThingAsDone} key="action-Done" />)
        }
        if (this.discardCommentsEnabled()) {
            actions.push(<Action label="Discard" doFunc={this.discardComments} key="action-Discard" />)
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
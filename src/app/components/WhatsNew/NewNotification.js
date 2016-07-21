const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')

const MessageRow = require('../Messages/MessageRow')
const Action = require('../Messages/Action')

const DoThingActions = require('../../actions/do-thing-actions')
const DismissCommentsActions = require('../../actions/dismiss-comments-actions')
const EventTypes = require('../../../common/enums/event-types')

class NewNotification extends Component {
    constructor(props) {
        super(props)
        this.doThing = this.doThing.bind(this)
        this.dismissComments = this.dismissComments.bind(this)
        this.doActionEnabled = this.doActionEnabled.bind(this)
    }

    doThing() {
        this.props.doThing(this.props.notification)
    }

    dismissComments() {
        this.props.dismissComments(this.props.notification, this.props.currentUser)
    }

    doActionEnabled() {
        return this.props.notification.eventType.key === EventTypes.CREATED.key
    }
    
    dismissCommentsEnabled() {
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
        if (this.dismissCommentsEnabled()) {
            actions.push(<Action label="Dismiss" doFunc={this.dismissComments} key="action-Dismiss" />)
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

const mapDispatchToProps = (dispatch) => {
    return {
        doThing: (notification) => dispatch(DoThingActions.doThing(notification)),
        dismissComments: (notification, currentUser) => dispatch(DismissCommentsActions.dismissComments(notification, currentUser))
    }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(NewNotification)
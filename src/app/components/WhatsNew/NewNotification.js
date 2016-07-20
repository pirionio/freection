const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const {withRouter} = require('react-router')
const dateFns = require('date-fns')

const DoThingActions = require('../../actions/do-thing-actions')
const DismissCommentsActions = require('../../actions/dismiss-comments-actions')
const EventTypes = require('../../../common/enums/event-types')

class NewNotification extends Component {
    constructor(props) {
        super(props)
        this.doThing = this.doThing.bind(this)
        this.dismissComments = this.dismissComments.bind(this)
        this.doneActionEnabled = this.doneActionEnabled.bind(this)
        this.showThing = this.showThing.bind(this)
    }

    doThing() {
        this.props.doThing(this.props.notification)
    }

    dismissComments() {
        this.props.dismissComments(this.props.notification, this.props.currentUser)
    }

    doneActionEnabled() {
        return this.props.notification.eventType.key === EventTypes.CREATED.key
    }
    
    dismissCommentsEnabled() {
        return this.props.notification.eventType.key === EventTypes.COMMENT.key
    }

    showThing() {
        this.props.router.push({
            pathname: `/tasks/${this.props.notification.thing.id}`,
            query: {from: '/whatsnew', notificationId: this.props.notification.id}
        })
    }

    render () {
        const {notification} = this.props
        const createdAt = dateFns.format(notification.createdAt, 'DD-MM-YYYY HH:mm')

        const doAction = this.doneActionEnabled() ?
            <div className="notification-do">
                <button onClick={this.doThing}>Do</button>
            </div> : ''

        const dismissCommentsAction = this.dismissCommentsEnabled() ?
            <div className="notification-dismiss-comments">
                <button onClick={this.dismissComments}>Dismiss</button>
            </div> : ''
        
        const commentCount = notification.payload.numOfNewComments > 1 ?
            <div className="notification-count">
                (+{notification.payload.numOfNewComments - 1})
            </div> : ''

        return (
            <div className="new-notification">
                <div className="notification-content">
                    <div className="notification-row">
                        <div className="notification-creator">
                            {notification.creator.email}
                        </div>
                        <div className="notification-subject">
                            <a onClick={this.showThing}>{notification.thing.subject}</a>
                            <div className="notification-type">
                                ({notification.eventType.label})
                            </div>
                        </div>
                        <div className="notification-creation-time">
                            {createdAt}
                        </div>
                    </div>
                    <div className="notification-row">
                        <div className="notification-text">
                            {notification.payload.text}
                        </div>
                        {commentCount}
                    </div>
                </div>
                <div className="notification-actions">
                    {doAction}
                    {dismissCommentsAction}
                </div>
            </div>
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

module.exports = connect(mapStateToProps, mapDispatchToProps)(withRouter(NewNotification))
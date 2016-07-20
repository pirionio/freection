const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const {withRouter} = require('react-router')
const dateFns = require('date-fns')

const DoThingActions = require('../../actions/do-thing-actions')
const EventTypes = require('../../../common/enums/event-types')

class NewNotification extends Component {
    constructor(props) {
        super(props)
        this.doThing = this.doThing.bind(this)
        this.doneActionEnabled = this.doneActionEnabled.bind(this)
        this.showThing = this.showThing.bind(this)
    }

    doThing() {
        this.props.doThing(this.props.notification)
    }

    doneActionEnabled() {
        return this.props.notification.eventType.key === EventTypes.CREATED.key
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
                        </div>
                        <div className="notification-type">
                            ({notification.eventType.label})
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
                </div>
            </div>
        )
    }
}

NewNotification.propTypes = {
    notification: PropTypes.object.isRequired
}

const mapDispatchToProps = (dispatch) => {
    return {
        doThing: (notification) => dispatch(DoThingActions.doThing(notification))
    }
}

module.exports = connect(null, mapDispatchToProps)(withRouter(NewNotification))
const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const moment = require('moment')

const DoThingActions = require('../../actions/do-thing-actions')

class NewNotification extends Component {

    constructor(props) {
        super(props)
        this.doThing = this.doThing.bind(this)
    }

    doThing() {
        this.props.doThing(this.props.notification)
    }

    render () {
        const {notification} = this.props
        const createdAt = moment(notification.createdAt).format('DD-MM-YYYY HH:mm')
        return (
            <div className="new-notification">
                <div className="notification-content">
                    <div className="notification-row">
                        <div className="notification-creator">
                            {notification.creator.email}
                        </div>
                        <div className="notification-subject">
                            {notification.subject}
                        </div>
                        <div className="notification-creation-time">
                            {createdAt}
                        </div>
                    </div>
                    <div className="notification-row notification-body">
                        {notification.body}
                    </div>
                </div>
                <div className="notification-actions">
                    <div className="notification-do">
                        <button onClick={this.doThing}>Do</button>
                    </div>
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

module.exports = connect(null, mapDispatchToProps)(NewNotification)
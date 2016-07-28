const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')

const MessageRow = require('../Messages/MessageRow')

class NewNotification extends Component {
    constructor(props) {
        super(props)
    }

    getNotificationViewModel() {
        const {notification} = this.props
        return Object.assign({}, notification, {
            entityId: notification.thing.id,
            subject: notification.thing.subject
        })
    }

    render () {
        const notification = this.getNotificationViewModel()
        return (
            <MessageRow message={notification}
                        currentUser={this.props.currentUser}
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
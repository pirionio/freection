const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const {sortBy} = require('lodash')
const ReactDOM = require('react-dom')

const {GeneralConstants} = require('../../constants')
const NewNotification = require('./NewNotification')
const WhatsNewActions = require('../../actions/whats-new-actions')

class WhatsNew extends Component {
    componentDidMount () {
        this.props.fetchWhatsNew()
        setInterval(() => {
            this.props.fetchWhatsNew()
        }, GeneralConstants.FETCH_INTERVAL_MILLIS)
    }

    componentWillUpdate () {
        const node = ReactDOM.findDOMNode(this)
        this.shouldScrollBottom = (node.scrollTop + node.offsetHeight) === node.scrollHeight
    }

    componentDidUpdate () {
        if (this.shouldScrollBottom) {
            let node = ReactDOM.findDOMNode(this)
            node.scrollTop = node.scrollHeight
        }
    }

    sortNotificationsByDate () {
        return sortBy(this.props.notifications, notification => notification.createdAt)
    }

    render () {
        const rows = this.props.notifications && this.props.notifications.length ?
            this.sortNotificationsByDate().map(notification => <NewNotification notification={notification} key={notification.eventId} />) :
            'There are no new Things'
        return (
            <div className="whats-new-container">
                <div className="whats-new-content">
                    {rows}
                </div>
            </div>
        )
    }
}

WhatsNew.propTypes = {
    notifications: PropTypes.array.isRequired
}

const mapStateToProps = (state) => {
    return {
        notifications: state.whatsNew.notifications
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchWhatsNew: () => dispatch(WhatsNewActions.fetchWhatsNew())
    }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(WhatsNew)
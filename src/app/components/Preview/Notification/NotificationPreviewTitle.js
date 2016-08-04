const React = require('react')
const {connect} = require('react-redux')

const ThingPageActions = require('../../../actions/thing-page-actions')

const NotificationPreviewTitle = ({notification, dispatch}) => {
    return <a onClick={() => dispatch(ThingPageActions.show(notification.thing.id)) }>{notification.thing.subject}</a>
}

module.exports = connect()(NotificationPreviewTitle)

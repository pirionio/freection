const React = require('react')
const {Component, PropTypes} = React

const BaseActionBar = require('./BaseActionsBar')

class EmailActionBar extends Component {

    getAllowedActions() {
        return {
            discardEmails: true
        }
    }

    render() {
        return (
            <BaseActionBar thing={this.props.thread}
                           allowedActions={this.getAllowedActions()} />
        )
    }
}

EmailActionBar.propTypes = {
    thread: PropTypes.object.isRequired,
    notification: PropTypes.object
}

module.exports = EmailActionBar

const React = require('react')
const {Component, PropTypes} = React

const MessageRow = require('../Messages/MessageRow')

class EmailRow extends Component {
    render () {
        return (
            <MessageRow message={this.props.email}
                        currentUser={this.props.currentUser}
                        context="/emails/whatsnew" />
        )
    }
}

EmailRow.propTypes = {
    email: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired
}

module.exports = EmailRow
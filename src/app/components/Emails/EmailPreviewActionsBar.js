const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')

const ActionsBar = require('../Actions/ActionsBar')
const {DiscardEmails, DoEmail} = require('../Actions/Actions')

class EmailPreviewActionsBar extends Component {
    render() {
        const {emailIds, email, currentUser} = this.props

        const actions = [
            DiscardEmails(emailIds),
            DoEmail(email, currentUser)
        ]

        return (
            <div>
                <ActionsBar actions={actions} email={email} />
            </div>
        )
    }
}

EmailPreviewActionsBar.propTypes = {
    emailIds: PropTypes.array.isRequired,
    email: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        currentUser: state.auth
    }
}

module.exports = connect(mapStateToProps)(EmailPreviewActionsBar)
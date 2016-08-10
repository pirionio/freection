const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')

const ActionsBar = require('../Actions/ActionsBar')
const {DiscardEmails, DoEmail} = require('../Actions/Actions')

class EmailPreviewActionsBar extends Component {
    render() {
        const {emailUids, email, currentUser, isRollover} = this.props

        const actions = [
            DiscardEmails(emailUids),
            DoEmail(email, currentUser)
        ]

        return (
            <div>
                <ActionsBar actions={actions} email={email} isRollover={isRollover} />
            </div>
        )
    }
}

EmailPreviewActionsBar.propTypes = {
    emailUids: PropTypes.array.isRequired,
    email: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    isRollover: PropTypes.bool
}

EmailPreviewActionsBar.defaultProps = {
    isRollover: false
}

function mapStateToProps(state) {
    return {
        currentUser: state.auth
    }
}

module.exports = connect(mapStateToProps)(EmailPreviewActionsBar)
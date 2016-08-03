const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')

const ActionsBar = require('../Actions/ActionsBar')
const {DiscardEmails} = require('../Actions/Actions')

class EmailPreviewActionsBar extends Component {
    render() {
        const {emailIds} = this.props

        const actions = [
            DiscardEmails(emailIds)
        ]

        return (
            <div>
                <ActionsBar actions={actions} />
            </div>
        )
    }
}

EmailPreviewActionsBar.propTypes = {
    emailIds: PropTypes.array.isRequired
}

function mapStateToProps(state) {
    return {
        currentUser: state.auth
    }
}

module.exports = connect(mapStateToProps)(EmailPreviewActionsBar)
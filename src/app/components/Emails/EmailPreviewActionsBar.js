import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import ActionsBar from '../Actions/ActionsBar'
import {DiscardEmails, DoEmail} from '../Actions/Actions'

class EmailPreviewActionsBar extends Component {
    render() {
        const {emailUids, email, currentUser} = this.props

        const actions = [
            DiscardEmails(emailUids),
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
    emailUids: PropTypes.array.isRequired,
    email: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired
}

EmailPreviewActionsBar.defaultProps = {
    isRollover: false
}

function mapStateToProps(state) {
    return {
        currentUser: state.auth
    }
}

export default connect(mapStateToProps)(EmailPreviewActionsBar)
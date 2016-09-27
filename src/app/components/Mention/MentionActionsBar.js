import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import ActionsBar from '../Actions/ActionsBar'

class MentionActionsBar extends Component {
    render() {
        const actions = []
        return <ActionsBar actions={actions} />
    }
}

MentionActionsBar.propTypes = {
    thing: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    preDoFunc: PropTypes.func
}

function mapStateToProps(state) {
    return {
        currentUser: state.auth
    }
}

export default connect(mapStateToProps)(MentionActionsBar)
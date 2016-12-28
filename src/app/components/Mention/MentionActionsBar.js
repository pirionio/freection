import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import ActionsBar from '../Actions/ActionsBar'
import {Unmute, Mute} from '../Actions/Actions'

class MentionActionsBar extends Component {
    render() {
        const {thing} = this.props

        const actions = [
            Unmute(thing),
            Mute(thing)
        ]

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
        currentUser: state.userProfile
    }
}

export default connect(mapStateToProps)(MentionActionsBar)
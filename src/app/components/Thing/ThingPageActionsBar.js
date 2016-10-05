import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import ActionsBar from '../Actions/ActionsBar'
import {DoAction, DoneAction, DismissAction, CloseAction, SendBackAction, JoinMention, LeaveMention} from '../Actions/Actions'

class ThingPageActionsBar extends Component {
    isDisabled() {
        return this.props.ongoingAction
    }

    render() {
        const {thing, currentUser} = this.props

        const actions = [
            DoAction(thing, currentUser, this.isDisabled()),
            DoneAction(thing, currentUser, this.isDisabled()),
            DismissAction(thing, currentUser, this.isDisabled()),
            CloseAction(thing, currentUser, this.isDisabled()),
            SendBackAction(thing, currentUser, this.isDisabled()),
            JoinMention(thing, currentUser, this.isDisabled()),
            LeaveMention(thing, currentUser, this.isDisabled())
        ]

        return (
            <div name="thing-page-actions-bar">
                <ActionsBar actions={actions} supportRollover={false} />
            </div>
        )
    }
}

ThingPageActionsBar.propTypes = {
    thing: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    ongoingAction: PropTypes.bool.isRequired
}

function mapStateToProps(state) {
    return {
        currentUser: state.auth,
        ongoingAction: state.thingPage.ongoingAction
    }
}

export default connect(mapStateToProps)(ThingPageActionsBar)
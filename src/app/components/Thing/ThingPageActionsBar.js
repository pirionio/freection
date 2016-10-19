import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'

import ActionsBar from '../Actions/ActionsBar'
import {DoAction, DoneAction, DismissAction, CloseAction, SendBackAction, Unmute, Mute, FollowUpAction,
    UnfollowAction} from '../Actions/Actions'
import * as MessageBoxActions from '../../actions/message-box-actions'
import ThingStatus from '../../../common/enums/thing-status'
import MessageTypes from '../../../common/enums/message-types'

class ThingPageActionsBar extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, ThingPageActionsBar.prototype)
    }

    isDisabled() {
        return this.props.ongoingAction
    }

    generatePreDoFunc(messageBoxTitle) {
        const {dispatch, thing} = this.props
        return action => {
            dispatch(MessageBoxActions.newMessageBox(MessageTypes.THING_ACTION, thing, action, messageBoxTitle))
        }
    }

    render() {
        const {thing, currentUser} = this.props

        const actions = [
            DoAction(thing, currentUser, this.isDisabled()),
            DoneAction(thing, currentUser, {disabled: this.isDisabled(), preDoFunc: !thing.isSelf ? this.generatePreDoFunc('Done') : undefined}),
            DismissAction(thing, currentUser, {disabled: this.isDisabled(), preDoFunc: this.generatePreDoFunc('Dismiss')}),
            SendBackAction(thing, currentUser, {disabled: this.isDisabled(), preDoFunc: this.generatePreDoFunc('Send Back')}),
            CloseAction(thing, currentUser, {
                disabled: this.isDisabled(),
                preDoFunc: [ThingStatus.NEW.key, ThingStatus.INPROGRESS.key, ThingStatus.REOPENED.key].includes(thing.payload.status) ?
                    this.generatePreDoFunc('Close') : undefined}),
            FollowUpAction(thing),
            Unmute(thing),
            UnfollowAction(thing),
            Mute(thing)
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
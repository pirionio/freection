import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'

import CommandsBar from '../Commands/CommandsBar'
import * as MessageBoxActions from '../../actions/message-box-actions'
import MessageTypes from '../../../common/enums/message-types'
import {getThingAllowedCommands} from '../../services/thing-service.js'
import ThingCommandActionTypes from '../../actions/types/thing-command-action-types.js'

class ThingPageActionsBar extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, ThingPageActionsBar.prototype)
    }

    isDisabled() {
        return this.props.ongoingAction
    }

    requireText(command, sendAction) {
        const {dispatch, thing} = this.props

        const messageBoxTitle =
            command === ThingCommandActionTypes.MARK_AS_DONE ? 'Done' :
            command === ThingCommandActionTypes.DISMISS ? 'Dismiss' :
            command === ThingCommandActionTypes.SEND_BACK ? 'Send Back' :
            command === ThingCommandActionTypes.CLOSE ? 'Close' : ''

        dispatch(MessageBoxActions.newMessageBox(MessageTypes.THING_ACTION, thing, sendAction, messageBoxTitle))
    }

    render() {
        const {thing} = this.props

        const commands = getThingAllowedCommands(thing, [
            ThingCommandActionTypes.DO_THING,
            ThingCommandActionTypes.MARK_AS_DONE,
            ThingCommandActionTypes.DISMISS,
            ThingCommandActionTypes.SEND_BACK,
            ThingCommandActionTypes.CLOSE,
            ThingCommandActionTypes.FOLLOW_UP,
            ThingCommandActionTypes.UNFOLLOW,
            ThingCommandActionTypes.CLOSED_UNFOLLOW,
            ThingCommandActionTypes.MUTE,
            ThingCommandActionTypes.UNMUTE
        ])

        return (
            <div name="thing-page-actions-bar">
                <CommandsBar thing={thing} commands={commands} requireTextFunc={this.requireText} supportRollover={false} />
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
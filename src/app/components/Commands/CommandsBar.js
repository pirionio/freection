import React, {Component, PropTypes} from 'react'
import head from 'lodash/head'
import classAutobind from 'class-autobind'
import Transition from 'react-motion-ui-pack'
import useSheet from 'react-jss'
import classNames from 'classnames'

import * as ThingCommandActions from '../../actions/thing-command-actions.js'
import ThingCommandActionTypes from '../../actions/types/thing-command-action-types.js'
import Command from './Command.js'

import Flexbox from '../UI/Flexbox'

class CommandsBar extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, CommandsBar.prototype)
    }

    getCommandComponent(command) {
        const {requireTextFunc, disabled} = this.props

        const {commandType, requireText} = command

        const props = this.getComponentProps(commandType)

        return <Command key={props.key}
                        label={props.label}
                        item={props.item}
                        commandType={commandType}
                        commandFunc={props.commandFunc}
                        requireTextFunc={requireTextFunc}
                        requireText={requireText}
                        disabled={disabled}
                        tooltipText={props.tooltipText} />
    }

    getComponentProps(commandType) {
        const {thing, notification} = this.props

        switch (commandType) {
            case ThingCommandActionTypes.DO_THING:
                return {
                    key: 'command-do',
                    label: 'Do',
                    commandFunc: ThingCommandActions.doThing,
                    item: thing,
                    tooltipText: `Move the thing to your To Do list`
                }
            case ThingCommandActionTypes.MARK_AS_DONE:
                return {
                    key: 'command-done',
                    label: 'Done',
                    commandFunc: ThingCommandActions.markAsDone,
                    item: thing,
                    tooltipText: thing.isTo && thing.isCreator ?
                        `Mark the thing as done and remove it from your To Do list` :
                        `Let ${thing.creator.payload.firstName} know you're done, and remove the thing from your To Do list`
                }
            case ThingCommandActionTypes.DISMISS:
                return {
                    key: 'command-dismiss',
                    label: 'Dismiss',
                    commandFunc: ThingCommandActions.dismiss,
                    item: thing,
                    tooltipText: thing.isTo && thing.isCreator ?
                        `Mark the thing as dismissed and remove it from your To Do list` :
                        `Let ${thing.creator.payload.firstName} know you won't do it, and remove the thing from your To Do list`
                }
            case ThingCommandActionTypes.CLOSE:
                return {
                    key: 'command-close',
                    label: 'Close',
                    commandFunc: ThingCommandActions.close,
                    item: thing,
                    tooltipText: thing.isDoer ?
                        `Close the thing and remove it from your To Do list` :
                        `Remove the thing from your Follow Up list`
                }
            case ThingCommandActionTypes.CANCEL:
                return {
                    key: 'command-cancel',
                    label: 'Close',
                    commandFunc: ThingCommandActions.cancel,
                    item: thing,
                    tooltipText: `Let the thing's doers know you close the thing, and remove it from your Follow Up list`
                }
            case ThingCommandActionTypes.SEND_BACK:
                return {
                    key: 'command-send-back',
                    label: 'Send Back',
                    commandFunc: ThingCommandActions.sendBack,
                    item: thing,
                    tooltipText: `Let the thing's doers know you want them to keep working on it`
                }
            case ThingCommandActionTypes.PING:
                return {
                    key: 'command-ping',
                    label: 'Ping',
                    commandFunc: ThingCommandActions.ping,
                    item: thing,
                    tooltipText: `Send a quick notification to ${thing.to.payload.firstName} to check up on it`
                }
            case ThingCommandActionTypes.PONG:
                return {
                    key: 'command-pong',
                    label: 'Pong',
                    commandFunc: ThingCommandActions.pong,
                    item: thing,
                    tooltipText: `Send a quick reply to the ${thing.creator.payload.firstName}'s ping`
                }
            case ThingCommandActionTypes.DISCARD_COMMENTS:
                return {
                    key: 'command-discard-comments',
                    label: 'Discard',
                    commandFunc: ThingCommandActions.discardComments,
                    item: notification,
                    tooltipText: `Remove notification from your Notifications list`
                }
            case ThingCommandActionTypes.DISCARD_SINGLE_NOTIFICATION:
                return {
                    key: 'command-discard',
                    label: 'Discard',
                    commandFunc: ThingCommandActions.discardSingleNotification,
                    item: notification,
                    tooltipText: `Remove notification from your Notifications list`
                }
            case ThingCommandActionTypes.UNMUTE:
                return {
                    key: 'command-unmute',
                    label: 'Unmute',
                    commandFunc: ThingCommandActions.unmute,
                    item: thing,
                    tooltipText: `Keep getting notifications for this thing`
                }
            case ThingCommandActionTypes.MUTE:
                return {
                    key: 'command-mute',
                    label: 'Mute',
                    commandFunc: ThingCommandActions.mute,
                    item: thing,
                    tooltipText: `Stop getting notifications for this thing`
                }
            case ThingCommandActionTypes.CLOSE_ACK:
                return {
                    key: 'command-close-ack',
                    label: 'Close',
                    commandFunc: ThingCommandActions.closeAck,
                    item: thing,
                    tooltipText: `Remove the thing from your To Do list`
                }
            case ThingCommandActionTypes.CLOSED_UNFOLLOW:
                return {
                    key: 'command-closed-unfollow',
                    label: 'Close',
                    commandFunc: ThingCommandActions.closedUnfollow,
                    item: thing,
                    tooltipText: `Remove this thing from your Follow Up list`
                }
            case ThingCommandActionTypes.FOLLOW_UP:
                return {
                    key: 'command-followup',
                    label: 'Follow Up',
                    commandFunc: ThingCommandActions.followUp,
                    item: thing,
                    tooltipText: `Add this thing to your Follow Up list`
                }
            case ThingCommandActionTypes.UNFOLLOW:
                return {
                    key: 'command-unfollow',
                    label: 'Unfollow',
                    commandFunc: ThingCommandActions.unfollow,
                    item: thing,
                    tooltipText: `Remove this thing from your Follow Up list`
                }
        }
    }

    render() {
        const {supportRollover, sheet: {classes}, commands, className} = this.props

        const components = commands.map(this.getCommandComponent)

        const firstCommand = head(components)
        const restOfCommands = components.slice(1)

        if (!supportRollover) {
            return (
                <Flexbox name="commands-bar" container='row-reverse' className={className}>
                    {[firstCommand, ...restOfCommands]}
                </Flexbox>
            )
        }

        const restOfCommandsClass = classNames(classes.restOfCommands, 'restOfCommands')

        return (
            <Flexbox name="commands-bar" container='row-reverse' className={className}>
                {firstCommand}
                <Transition component="div"
                            enter={{opacity: 1}}
                            leave={{opacity: 0}}
                            appear={{opacity: 0}}>
                    <div key="rest-of-commands" className={restOfCommandsClass}>
                        <Flexbox name="rest-of-commands-row" container="row-reverse">
                            {restOfCommands}
                        </Flexbox>
                    </div>
                </Transition>
            </Flexbox>
        )
    }
}

const style = {
    restOfCommands: {
        display: 'none'
    }
}

CommandsBar.propTypes = {
    commands: PropTypes.array.isRequired,
    thing: PropTypes.object.isRequired,
    notification: PropTypes.object,
    requireTextFunc: PropTypes.func,
    supportRollover: PropTypes.bool,
    disabled: PropTypes.bool,
    className: PropTypes.string
}

CommandsBar.defaultProps = {
    supportRollover: true,
    disabled: false
}

export default useSheet(CommandsBar, style)


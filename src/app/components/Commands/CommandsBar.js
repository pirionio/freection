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
                        disabled={disabled} />
    }

    getComponentProps(commandType) {
        const {thing, notification} = this.props

        switch (commandType) {
            case ThingCommandActionTypes.DO_THING:
                return {
                    key: 'command-do',
                    label: 'Do',
                    commandFunc: ThingCommandActions.doThing,
                    item: thing
                }
            case ThingCommandActionTypes.MARK_AS_DONE:
                return {
                    key: 'command-done',
                    label: 'Done',
                    commandFunc: ThingCommandActions.markAsDone,
                    item: thing
                }
            case ThingCommandActionTypes.DISMISS:
                return {
                    key: 'command-dismiss',
                    label: 'Dismiss',
                    commandFunc: ThingCommandActions.dismiss,
                    item: thing
                }
            case ThingCommandActionTypes.CLOSE:
                return {
                    key: 'command-close',
                    label: 'Close',
                    commandFunc: ThingCommandActions.close,
                    item: thing
                }
            case ThingCommandActionTypes.CANCEL:
                return {
                    key: 'command-cancel',
                    label: 'Close',
                    commandFunc: ThingCommandActions.cancel(),
                    item: thing
                }
            case ThingCommandActionTypes.SEND_BACK:
                return {
                    key: 'command-send-back',
                    label: 'Send Back',
                    commandFunc: ThingCommandActions.sendBack,
                    item: thing
                }
            case ThingCommandActionTypes.PING:
                return {
                    key: 'command-ping',
                    label: 'Ping',
                    commandFunc: ThingCommandActions.ping,
                    item: thing
                }
            case ThingCommandActionTypes.PONG:
                return {
                    key: 'command-pong',
                    label: 'Pong',
                    commandFunc: ThingCommandActions.pong,
                    item: thing
                }
            case ThingCommandActionTypes.DISCARD_COMMENTS:
                return {
                    key: 'command-discard-comments',
                    label: 'Discard',
                    commandFunc: ThingCommandActions.discardComments,
                    item: notification
                }
            case ThingCommandActionTypes.DISCARD_SINGLE_NOTIFICATION:
                return {
                    key: 'command-discard',
                    label: 'Discard',
                    commandFunc: ThingCommandActions.discardSingleNotification,
                    item: notification
                }
            case ThingCommandActionTypes.UNMUTE:
                return {
                    key: 'command-unmute',
                    label: 'Unmute',
                    commandFunc: ThingCommandActions.unmute,
                    item: thing
                }
            case ThingCommandActionTypes.MUTE:
                return {
                    key: 'command-mute',
                    label: 'Mute',
                    commandFunc: ThingCommandActions.mute,
                    item: thing
                }
            case ThingCommandActionTypes.CLOSE_ACK:
                return {
                    key: 'command-close-ack',
                    label: 'Close',
                    commandFunc: ThingCommandActions.closeAck,
                    item: thing
                }
            case ThingCommandActionTypes.CLOSED_UNFOLLOW:
                return {
                    key: 'command-closed-unfollow',
                    label: 'Close',
                    commandFunc: ThingCommandActions.closedUnfollow,
                    item: thing
                }
            case ThingCommandActionTypes.FOLLOW_UP:
                return {
                    key: 'command-followup',
                    label: 'Follow Up',
                    commandFunc: ThingCommandActions.followUp,
                    item: thing
                }
            case ThingCommandActionTypes.UNFOLLOW:
                return {
                    key: 'command-unfollow',
                    label: 'Unfollow',
                    commandFunc: ThingCommandActions.unfollow,
                    item: thing
                }
        }
    }

    render() {
        const {supportRollover, sheet: {classes}, commands} = this.props

        const components = commands.map(this.getCommandComponent)

        const firstCommand = head(components)
        const restOfCommands = components.slice(1)

        if (!supportRollover) {
            return (
                <Flexbox name="commands-bar" container='row-reverse'>
                    {[firstCommand, ...restOfCommands]}
                </Flexbox>
            )
        }

        const restOfCommandsClass = classNames(classes.restOfCommands, 'restOfCommands')

        return (
            <Flexbox name="commands-bar" container='row-reverse'>
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
    disabled: PropTypes.bool
}

CommandsBar.defaultProps = {
    supportRollover: true,
    disabled: false
}

export default useSheet(CommandsBar, style)


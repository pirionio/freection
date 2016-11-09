import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Form} from 'react-redux-form'
import classAutobind from 'class-autobind'
import AddressParser from 'email-addresses'
import useSheet from 'react-jss'
import classNames from 'classnames'
import find from 'lodash/find'
import isNil from 'lodash/isNil'
import isEmpty from 'lodash/isEmpty'
import map from 'lodash/map'
import some from 'lodash/some'
import defaultsDeep from 'lodash/defaultsDeep'
import {chain} from 'lodash/core'

import * as MessageBoxActions from '../../actions/message-box-actions'
import Flexbox from '../UI/Flexbox'
import MessageBox from './MessageBox'
import CollapsedMessageBox from './CollapsedMessageBox'
import MessageTabs from './MessageTabs'
import * as ThingCommandActions from '../../actions/thing-command-actions'
import MessageTypes from '../../../common/enums/message-types'
import styleVars from '../style-vars'
import componentStyles from '../component-styles'

class MessagePanel extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, MessagePanel.prototype)
    }

    send() {
        const {dispatch, messageBox, activeMessageBox} = this.props

        let promise
        switch (activeMessageBox.type.key) {
            case MessageTypes.NEW_THING.key:
                promise = dispatch(ThingCommandActions.newThing(messageBox.message))
                break
            case MessageTypes.COMMENT_THING.key:
                promise = dispatch(ThingCommandActions.comment(activeMessageBox.context.id, messageBox.message.body))
                break
            case MessageTypes.THING_ACTION.key:
                promise = messageBox.action(messageBox.message.body)
                break
        }

        dispatch(MessageBoxActions.messageSent(activeMessageBox.id, promise))
    }

    isSendDisabled() {
        const {activeMessageBox, messageBox} = this.props

        // Disable if there's no box at all, or there's an ongoing action.
        if (isNil(activeMessageBox) || activeMessageBox.ongoingAction || !messageBox.message) {
            return true
        }

        // In case of a new entity being created, disable only if there's no valid address.
        if (activeMessageBox.type.key === MessageTypes.NEW_THING.key &&
            !isEmpty(messageBox.message.to) && !AddressParser.parseOneAddress(messageBox.message.to)) {
            return true
        }

        // In case of a reply to an existing entity, disable if there's no body.
        return isEmpty(messageBox.message.body)
    }

    onCommandEnter() {
        if (!this.isSendDisabled())
            this.send()
    }

    getMessageBox() {
        const {activeMessageBox} = this.props
        return this.isCollapsed() ?
            <CollapsedMessageBox /> :
            <MessageBox to={activeMessageBox.context ? null : ''}
                        onCommandEnter={this.onCommandEnter}
            />
    }

    getSendButton() {
        const {activeMessageBox, sheet: {classes}} = this.props

        const sendClass = classNames(classes.sendButtonContainer, classes.send)
        const buttonClass = classNames(classes.sendButton, this.isSendDisabled() && classes.disabledSendButton)

        return !isNil(activeMessageBox) ?
            <div name="send-container" className={sendClass}>
                <button type="button"
                        tabIndex="3"
                        onClick={this.send}
                        disabled={this.isSendDisabled()}
                        className={buttonClass}>
                    Send
                </button>
            </div> :
            null
    }

    isFullItemMode() {
        const {messageBoxes} = this.props
        return some(messageBoxes, messageBox => messageBox.type.key === MessageTypes.COMMENT_THING.key)
    }

    isCollapsed() {
        return isNil(this.props.activeMessageBox)
    }

    render () {
        const {isExpandedOpened, sheet: {classes}} = this.props

        // If expanded is open we don't draw anything
        if (isExpandedOpened)
            return null

        const messageBox = this.getMessageBox()
        const sendButton = this.getSendButton()

        return (
            <Form model="messageBox" className={classes.form}>
                <Flexbox name="message-panel" container="row" className={classes.panel}>
                    <Flexbox name="message-box" grow={1} container="column" className={classes.box}>
                        {!this.isCollapsed() ? <MessageTabs /> : null}
                        <Flexbox container="column">
                            {messageBox}
                        </Flexbox>
                    </Flexbox>
                    {sendButton}
                </Flexbox>
            </Form>
        )
    }
}

const style = defaultsDeep({
    form: {
        padding: [0, 39],
        marginBottom: 0
    },
    panel: {
        position: 'relative'
    },
    box: {
        width: '100%'
    },
    send: {
        position: 'absolute',
        bottom: 20,
        right: 30
    },
    sendButtonContainer: {
        width: 82
    },
    sendButton: {
        height: 33,
        backgroundColor: styleVars.highlightColor,
        fontSize: '0.857em',
        color: 'white',
        border: 'none',
        '&:focus':{
            border: `1px solid ${styleVars.primaryColor}`
        },
        '&:hover': {
            color: styleVars.primaryColor
        }
    },
    disabledSendButton: {
        opacity: 0.5,
        backgroundColor: styleVars.highlightColor,
        border: 'none'
    }
}, componentStyles)

MessagePanel.propTypes = {
    messageBoxes: PropTypes.array.isRequired,
    activeMessageBox: PropTypes.object,
    messageBox: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    isExpandedOpened: PropTypes.bool.isRequired
}

function mapStateToProps(state) {
    return {
        messageBoxes: state.messagePanel.messageBoxes,
        activeMessageBox: find(state.messagePanel.messageBoxes, {id: state.messagePanel.activeMessageBoxId}),
        messageBox: state.messageBox,
        currentUser: state.auth,
        isExpandedOpened: state.expandedMessageBox.opened
    }
}

export default useSheet(connect(mapStateToProps)(MessagePanel), style)

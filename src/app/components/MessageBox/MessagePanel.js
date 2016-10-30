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
import * as EmailCommandActions from '../../actions/email-command-actions'
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
            case MessageTypes.NEW_EMAIL.key:
                promise = dispatch(EmailCommandActions.newEmail(messageBox.message))
                break
            case MessageTypes.COMMENT_THING.key:
                promise = dispatch(ThingCommandActions.comment(activeMessageBox.context.id, messageBox.message.body))
                break
            case MessageTypes.REPLY_EMAIL.key:
                const toEmails = this.getToEmails()
                const lastMessage = chain(activeMessageBox.context.messages).sortBy('createdAt').head().clone().value()
                const references = map(activeMessageBox.context.messages, 'id')

                promise = dispatch(EmailCommandActions.replyToAll(activeMessageBox.context.id, messageBox.message.body,
                    activeMessageBox.context.subject, toEmails, lastMessage.id, references))
                break
            case MessageTypes.THING_ACTION.key:
                promise = messageBox.action(messageBox.message.body)
                break
        }

        dispatch(MessageBoxActions.messageSent(activeMessageBox.id, promise))
    }

    getToEmails() {
        const {activeMessageBox, currentUser} = this.props
        return chain([...activeMessageBox.context.to, activeMessageBox.context.creator])
            .filter(user => user.payload.email !== currentUser.email)
            .map(user => user.payload.email)
            .value()
    }

    isSendDisabled() {
        const {activeMessageBox, messageBox} = this.props

        // Disable if there's no box at all, or there's an ongoing action.
        if (isNil(activeMessageBox) || activeMessageBox.ongoingAction || !messageBox.message) {
            return true
        }

        // In case of a new entity being created, disable only if there's no valid address.
        if ([MessageTypes.NEW_THING.key, MessageTypes.NEW_EMAIL.key].includes(activeMessageBox.type.key)) {
            return !AddressParser.parseOneAddress(messageBox.message.to)
        }

        // In case of a reply to an existing entity, disable if there's no body.
        return isEmpty(messageBox.message.body)
    }

    getMessageBox() {
        const {activeMessageBox} = this.props
        return this.isCollapsed() ?
            <CollapsedMessageBox /> :
            <MessageBox to={activeMessageBox.context ? null : ''} subject={activeMessageBox.context ? null : ''} />
    }

    getSendButton() {
        const {activeMessageBox, sheet: {classes}} = this.props

        const sendClass = classNames(classes.sendButtonContainer, classes.send)
        const buttonClass = classNames(classes.sendButton, this.isSendDisabled() && classes.disabledSendButton)

        return !isNil(activeMessageBox) ?
            <div name="send-container" className={sendClass}>
                <button type="button"
                        tabIndex="4"
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
        return some(messageBoxes, messageBox => [MessageTypes.COMMENT_THING.key, MessageTypes.REPLY_EMAIL.key].includes(messageBox.type.key))
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
                    <Flexbox name="message-box" grow={1} container="column">
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

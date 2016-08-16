const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const {Form} = require('react-redux-form')
const classAutobind = require('class-autobind').default
const radium = require('radium')

const find = require('lodash/find')
const isNil = require('lodash/isNil')
const map = require('lodash/map')
const merge = require('lodash/merge')
const {chain} = require('lodash/core')

const MessageBoxActions = require('../../actions/message-box-actions')

const Flexbox = require('../UI/Flexbox')
const TextTruncate = require('../UI/TextTruncate')
const MessageBox = require('./MessageBox')
const CollapsedMessageBox = require('./CollapsedMessageBox')
const MessageTabs = require('./MessageTabs')
const ThingCommandActions = require('../../actions/thing-command-actions')
const EmailCommandActions = require('../../actions/email-command-actions')
const MessageTypes = require('../../../common/enums/message-types')

const styleVars = require('../style-vars')

class MessagePanel extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, MessagePanel.prototype)
    }

    parseTo(to) {
        // TODO: what do do with invalid emails?
        // TODO: can we use regex?
        const beginIndex = to.indexOf('<')
        const endIndex = to.indexOf('>')

        if (beginIndex !== -1 && endIndex !== -1 && endIndex > beginIndex) {
            return to.substr(beginIndex + 1, endIndex - beginIndex - 1)
        }

        return to
    }

    buildMessage() {
        const {messageBox} = this.props
        const {message} = messageBox

        const to = this.parseTo(message.to)
        return merge(message, {to})
    }

    send() {
        const {dispatch, messageBox, activeMessageBox} = this.props

        let promise, shouldClose = true
        switch (activeMessageBox.type.key) {
            case MessageTypes.NEW_THING.key:
                promise = dispatch(ThingCommandActions.newThing(this.buildMessage()))
                break
            case MessageTypes.NEW_EMAIL.key:
                promise = dispatch(EmailCommandActions.newEmail(this.buildMessage()))
                break
            case MessageTypes.COMMENT_THING.key:
                promise = dispatch(ThingCommandActions.comment(activeMessageBox.context.id, messageBox.message.body))
                shouldClose = false
                break
            case MessageTypes.REPLY_EMAIL.key:
                const toEmails = map(activeMessageBox.context.to, 'payload.email')
                const lastMessage = chain(activeMessageBox.context.messages).sortBy('createdAt').head().clone().value()
                const references = map(activeMessageBox.context.messages, 'id')

                promise = dispatch(EmailCommandActions.replyToAll(activeMessageBox.context.id, messageBox.message.body,
                    activeMessageBox.context.subject, toEmails, lastMessage.id, references))
                shouldClose = false
                break
        }

        dispatch(MessageBoxActions.messageSent(activeMessageBox.id, shouldClose, promise))
    }

    isSendDisabled() {
        const {activeMessageBox} = this.props
        return isNil(activeMessageBox) || activeMessageBox.ongoingAction
    }

    getStyles() {
        return {
            form: {
                width: '100%'
            },
            panel: {
                position: 'relative'
            },
            send: {
                position: 'absolute',
                width: '88px',
                bottom: '15px',
                right: '15px',
                button: {
                    height: '39px',
                    width: '100%',
                    color: '#0e0522',
                    outline: 'none',
                    border: `1px solid ${styleVars.primaryColor}`,
                    backgroundColor: 'inherit',
                    ':focus':{
                        border: `1px solid ${styleVars.highlightColor}`
                    },
                    ':hover': {
                        cursor: 'pointer',
                        color: styleVars.highlightColor
                    },
                    disabled: {
                        backgroundColor: styleVars.disabledColor,
                        border: '1px solid #bababa',
                        cursor: 'not-allowed'
                    }
                }
            }
        }
    }

    getMessageBox() {
        const {activeMessageBox} = this.props
        return isNil(activeMessageBox) ?
            <CollapsedMessageBox /> :
            <MessageBox to={activeMessageBox.context ? null : ""} subject={activeMessageBox.context ? null : ""} />
    }

    getSendButton() {
        const {activeMessageBox} = this.props
        const styles = this.getStyles()
        return !isNil(activeMessageBox) ?
            <div name="send-container" style={styles.send}>
                <button type="submit"
                        tabIndex="4"
                        disabled={this.isSendDisabled()}
                        style={[styles.send.button, this.isSendDisabled() && styles.send.button.disabled]}>
                    Send
                </button>
            </div> :
            null
    }

    render () {
        const styles = this.getStyles()

        const messageBox = this.getMessageBox()
        const sendButton = this.getSendButton()

        return (
            <Form model="messageBox" onSubmit={this.send} style={styles.form}>
                <Flexbox name="message-panel" container="row" style={styles.panel}>
                    <Flexbox name="message-box" grow={1} container="column">
                        <MessageTabs />
                        {messageBox}
                    </Flexbox>
                    {sendButton}
                </Flexbox>
            </Form>
        )
    }
}

MessagePanel.propTypes = {
    messageBoxes: PropTypes.array.isRequired,
    activeMessageBox: PropTypes.object,
    messageBox: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        messageBoxes: state.messagePanel.messageBoxes,
        activeMessageBox: find(state.messagePanel.messageBoxes, {id: state.messagePanel.activeMessageBoxId}),
        messageBox: state.messageBox
    }
}

module.exports = connect(mapStateToProps)(radium(MessagePanel))

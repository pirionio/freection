const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const {Form} = require('react-redux-form')
const classAutobind = require('class-autobind').default
const radium = require('radium')
const AddressParser = require('email-addresses')

const find = require('lodash/find')
const isNil = require('lodash/isNil')
const isEmpty = require('lodash/isEmpty')
const map = require('lodash/map')
const merge = require('lodash/merge')
const some = require('lodash/some')
const {chain} = require('lodash/core')

const MessageBoxActions = require('../../actions/message-box-actions')

const Flexbox = require('../UI/Flexbox')
const MessageBox = require('./MessageBox')
const CollapsedMessageBox = require('./CollapsedMessageBox')
const MessageTabs = require('./MessageTabs')
const ThingCommandActions = require('../../actions/thing-command-actions')
const EmailCommandActions = require('../../actions/email-command-actions')
const MessageTypes = require('../../../common/enums/message-types')

const componentStyles = require('../component-styles')

class MessagePanel extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, MessagePanel.prototype)
    }

    send() {
        const {dispatch, messageBox, activeMessageBox} = this.props

        let promise, shouldClose = true
        switch (activeMessageBox.type.key) {
            case MessageTypes.NEW_THING.key:
                promise = dispatch(ThingCommandActions.newThing(messageBox.message))
                break
            case MessageTypes.NEW_EMAIL.key:
                promise = dispatch(EmailCommandActions.newEmail(messageBox.message))
                break
            case MessageTypes.COMMENT_THING.key:
                promise = dispatch(ThingCommandActions.comment(activeMessageBox.context.id, messageBox.message.body))
                shouldClose = false
                break
            case MessageTypes.REPLY_EMAIL.key:
                const toEmails = this.getToEmails()
                const lastMessage = chain(activeMessageBox.context.messages).sortBy('createdAt').head().clone().value()
                const references = map(activeMessageBox.context.messages, 'id')

                promise = dispatch(EmailCommandActions.replyToAll(activeMessageBox.context.id, messageBox.message.body,
                    activeMessageBox.context.subject, toEmails, lastMessage.id, references))
                shouldClose = false
                break
        }

        dispatch(MessageBoxActions.messageSent(activeMessageBox.id, shouldClose, promise))
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
        const addressValid =
            [MessageTypes.NEW_THING.key, MessageTypes.NEW_EMAIL.key].includes(activeMessageBox.type.key) && messageBox && messageBox.message ?
                AddressParser.parseOneAddress(messageBox.message.to) :
                true
        return isNil(activeMessageBox) || activeMessageBox.ongoingAction || !addressValid
    }

    getStyles() {
        return {
            form: {
                padding: '0 39px',
                marginBottom: '0'
            },
            panel: {
                position: 'relative'
            },
            send: {
                position: 'absolute',
                bottom: '15px',
                right: '15px'
            },
            notFullItemBox: {
                boxShadow: '0px 0px 40px 0px rgba(0, 0, 0, 0.15)'
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
            <div name="send-container" style={[componentStyles.sendButton, styles.send]}>
                <button type="submit"
                        tabIndex="4"
                        disabled={this.isSendDisabled()}
                        style={[componentStyles.sendButton.button, this.isSendDisabled() && componentStyles.sendButton.disabled]}>
                    Send
                </button>
            </div> :
            null
    }

    isFullItemMode() {
        const {messageBoxes} = this.props
        return some(messageBoxes, messageBox => [MessageTypes.COMMENT_THING.key, MessageTypes.REPLY_EMAIL.key].includes(messageBox.type.key))
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
                        <Flexbox container="column" style={[!this.isFullItemMode() && styles.notFullItemBox]}>
                            {messageBox}
                        </Flexbox>
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
    messageBox: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        messageBoxes: state.messagePanel.messageBoxes,
        activeMessageBox: find(state.messagePanel.messageBoxes, {id: state.messagePanel.activeMessageBoxId}),
        messageBox: state.messageBox,
        currentUser: state.auth
    }
}

module.exports = connect(mapStateToProps)(radium(MessagePanel))

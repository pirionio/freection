const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const {Form, Field} = require('react-redux-form')
const classAutobind = require('class-autobind').default
const radium = require('radium')
const isEmpty = require('lodash/isEmpty')

const MessageBoxActions = require('../../actions/message-box-actions')

const Flexbox = require('../UI/Flexbox')
const TextTruncate = require('../UI/TextTruncate')
const NewMessageBox = require('./NewMessageBox')
const NewMessageTabs = require('./NewMessageTabs')
const ThingCommandActions = require('../../actions/thing-command-actions')
const EmailCommandActions = require('../../actions/email-command-actions')
const MessageTypes = require('../../../common/enums/message-types')

const styleVars = require('../style-vars')

class NewMessagePanel extends Component {
    constructor(props) {
        super(props)
        classAutobind(this)
    }

    send() {
        const {dispatch, newMessageBox, activeMessageBox} = this.props

        let promise, shouldClose = true
        switch (activeMessageBox.type.key) {
            case MessageTypes.NEW_THING.key:
                console.log('newThing')
                promise = dispatch(ThingCommandActions.newThing(newMessageBox.message))
                break
            case MessageTypes.NEW_EMAIL.key:
                console.log('newEmail')
                promise = dispatch(EmailCommandActions.newEmail(newMessageBox.message))
                break
            case MessageTypes.NEW_COMMENT.key:
                console.log('comment')
                promise = dispatch(ThingCommandActions.comment(activeMessageBox.context.id, newMessageBox.message.body))
                shouldClose = false
                break
        }

        dispatch(MessageBoxActions.messageSent(activeMessageBox, shouldClose, promise))
    }

    isSendDisabled() {
        const {activeMessageBox} = this.props
        return isEmpty(activeMessageBox) || activeMessageBox.ongoingAction
    }

    getStyles() {
        return {
            form: {
                width: '100%'
            },
            panel: {
                height: '200px',
                position: 'relative'
            },
            messageTypeSelector: {
                width: '80px'
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

    render () {
        const {newMessageBox, activeMessageBox} = this.props
        const styles = this.getStyles()

        return (
            <Form model="newMessageBox" onSubmit={this.send} style={styles.form}>
                <Flexbox name="message-panel" container="row" style={styles.panel}>
                    <Flexbox name="message-box" grow={1} container="column">
                        <NewMessageTabs />
                        <NewMessageBox to={activeMessageBox.context ? null : ""}
                                       subject={activeMessageBox.context ? null : ""} />
                    </Flexbox>
                    <div name="send-container" style={styles.send}>
                        <button type="submit"
                                tabIndex="4"
                                disabled={this.isSendDisabled()}
                                style={[styles.send.button, this.isSendDisabled() && styles.send.button.disabled]}>
                            Send
                        </button>
                    </div>
                </Flexbox>
            </Form>
        )
    }
}

NewMessagePanel.propTypes = {
    messageBoxes: PropTypes.array.isRequired,
    activeMessageBox: PropTypes.object.isRequired,
    newMessageBox: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        messageBoxes: state.newMessagePanel.messageBoxes,
        activeMessageBox: state.newMessagePanel.activeMessageBox,
        newMessageBox: state.newMessageBox
    }
}

module.exports = connect(mapStateToProps)(radium(NewMessagePanel))

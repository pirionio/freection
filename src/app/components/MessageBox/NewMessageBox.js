const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const {Form, Field} = require('react-redux-form')
const classAutobind = require('class-autobind').default

const Flexbox = require('../UI/Flexbox')
const ThingCommandActions = require('../../actions/thing-command-actions')
const EmailCommandActions = require('../../actions/email-command-actions')
const MessageTypeSelector = require('./MessageTypeSelector')
const MessageTypes = require('../../../common/enums/message-types')

const styleVars = require('../style-vars')

class NewMessageBox extends Component {
    constructor(props) {
        super(props)
        classAutobind(this)
    }

    send() {
        const {dispatch, newMessageBox} = this.props

        switch (newMessageBox.selectedOption) {
            case MessageTypes.NEW_THING:
                dispatch(ThingCommandActions.newThing(newMessageBox.message))
                break
            case MessageTypes.NEW_EMAIL:
                dispatch(EmailCommandActions.newEmail(newMessageBox.message))
                break
        }

        this.messageSubject.focus()
    }

    getStyles() {
        return {
            form: {
                width: '100%'
            },
            panel: {
                height: '200px'
            },
            box: {
                position: 'relative'
            },
            topBar: {
                height: '40px',
                backgroundColor: styleVars.primaryColor
            },
            boxText: {
                backgroundColor: 'white',
                border: `1px solid ${styleVars.primaryColor}`
            },
            messageTypeSelector: {
                width: '80px'
            },
            messageAdditionalInfo: {
                height: '40px',
                width: '100%',
                padding: '10px 10px'
            },
            messageTo: {
                height: '40px',
                width: 'calc(100% - 70px)',
                padding: '10px 10px'
            },
            messageBody: {
                padding: '0 10px'
            },
            textField: {
                width: '100%',
                border: 'none',
                outline: 'none',
                resize: 'none'
            },
            send: {
                position: 'absolute',
                width: '60px',
                bottom: '40px',
                right: '140px',
                border: `1px solid ${styleVars.primaryColor}`,
                button: {
                    height: '30px',
                    width: '100%',
                    border: 'none',
                    backgroundColor: styleVars.primaryColor,
                    color: 'white',
                    ':focus':{
                        outlineColor: styleVars.secondaryColor
                    },
                    ':hover': {
                        cursor: 'pointer',
                        color: styleVars.secondaryColor
                    }

                }
            }
        }
    }

    render () {
        const {newMessageBox} = this.props
        const styles = this.getStyles()

        return (
            <Form model="newMessageBox" onSubmit={this.send} style={styles.form}>
                <Flexbox name="message-panel" container="row" style={styles.panel}>
                    <Flexbox name="message-box" grow={1} container="column" style={styles.box}>
                        <Flexbox name="message-box-top-bar" style={styles.topBar} />
                        <Flexbox name="message-text" grow={1} style={styles.boxText} container="column">
                            <Flexbox name="message-subject" style={styles.messageAdditionalInfo}>
                                <Field model="newMessageBox.message.subject">
                                    <input type="text" style={styles.textField} tabIndex="1" placeholder="Subject" autoFocus
                                           ref={ref => this.messageSubject = ref}/>
                                </Field>
                            </Flexbox>
                            <Flexbox name="message-body" grow={1} container={true} style={styles.messageBody}>
                                <Field model="newMessageBox.message.body">
                                    <textarea style={styles.textField} tabIndex="2" placeholder="Wrtie your message here" />
                                </Field>
                            </Flexbox>
                            <Flexbox name="message-to" style={styles.messageTo}>
                                <Field model="newMessageBox.message.to">
                                    <input type="text" style={styles.textField} tabIndex="3" placeholder="To" />
                                </Field>
                            </Flexbox>
                        </Flexbox>
                    </Flexbox>
                    <Flexbox name="message-selector" style={styles.messageTypeSelector}>
                        <MessageTypeSelector />
                    </Flexbox>
                    <div name="send-container" style={styles.send}>
                        <button type="submit" style={styles.send.button} tabIndex="4" disabled={newMessageBox.ongoingAction}>Send</button>
                    </div>
                </Flexbox>
            </Form>
        )
    }
}

NewMessageBox.propTypes = {
    newMessageBox: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        newMessageBox: state.newMessageBox
    }
}

module.exports = connect(mapStateToProps)(NewMessageBox)

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

        this.messageTo.focus()
    }

    getStyles() {
        return {
            box: {
                height: '120px'
            },
            form: {
                width: '100%'
            },
            messageTypeSelector: {
                width: '80px',
                marginRight: '10px'
            },
            messageTo: {
                height: '25px'
            },
            messageBody: {
                height: '70px',
                margin: '-1px 0 -1px'
            },
            messageSubject: {
                height: '25px'
            },
            send: {
                width: '60px',
                marginLeft: '10px'
            }
        }
    }

    render () {
        const {newMessageBox} = this.props
        const styles = this.getStyles()

        return (
            <Form model="newMessageBox" onSubmit={this.send} style={styles.form}>
                <Flexbox name="message-box" shrink={0} container="row" style={styles.box}>
                    <Flexbox name="message-type-container" shrink={0} style={styles.messageTypeSelector}>
                        <MessageTypeSelector />
                    </Flexbox>
                    <Flexbox name="box-text-container" grow={1} container="column">
                        <Field model="newMessageBox.message.to">
                            <input type="email" style={styles.messageTo} tabIndex="1" placeholder="to" autoFocus
                                   ref={ref => this.messageTo = ref}/>
                        </Field>
                        <Field model="newMessageBox.message.body">
                            <textarea style={styles.messageBody} tabIndex="2" placeholder="new message"/>
                        </Field>
                        <Field model="newMessageBox.message.subject">
                            <input type="text" style={styles.messageSubject} tabIndex="3" placeholder="subject" />
                        </Field>
                    </Flexbox>
                    <Flexbox name="send-container" style={styles.send}>
                        <button type="submit" tabIndex="4" disabled={newMessageBox.ongoingAction}>Send</button>
                    </Flexbox>
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

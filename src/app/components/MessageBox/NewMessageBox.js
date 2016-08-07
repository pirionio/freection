const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const {Form, Field} = require('react-redux-form')
const classAutobind = require('class-autobind').default

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

    render () {
        const {newMessageBox} = this.props

        return (
            <div className="message-box">
                <Form model="newMessageBox" onSubmit={this.send}>
                    <div className="new-selector-container">
                        <MessageTypeSelector />
                    </div>
                    <div className="text-section">
                        <Field model="newMessageBox.message.to">
                            <input type="email" className="message-recipients" tabIndex="1" placeholder="to" autoFocus
                                   ref={ref => this.messageTo = ref}/>
                        </Field>
                        <Field model="newMessageBox.message.body">
                            <textarea className="message-text" tabIndex="2" placeholder="new message"/>
                        </Field>
                        <Field model="newMessageBox.message.subject">
                            <input type="text" className="message-subject" tabIndex="3" placeholder="subject" />
                        </Field>
                    </div>
                    <div className="send-section">
                        <button type="submit" className="send-button" tabIndex="4" disabled={newMessageBox.ongoingAction}>Send</button>
                    </div>
                </Form>
            </div>
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
const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const {Form, Field} = require('react-redux-form')
const isEmpty = require('lodash/isEmpty')
const classAutobind = require('class-autobind').default

const ThingCommandActions = require('../../actions/thing-command-actions')

class MessageBox extends Component {
    constructor(props) {
        super(props)
        classAutobind(this)
    }

    send() {
        const {dispatch, messageBox, thingContext} = this.props

        if (this.isComment()) {
            dispatch(ThingCommandActions.comment(thingContext.id, messageBox.message.body))
            this.messageBody.focus()
        } else {
            dispatch(ThingCommandActions.newThing(messageBox.message))
            this.messageTo.focus()
        }
    }

    isComment() {
        return !isEmpty(this.props.thingContext)
    }

    render () {
        const {messageBox} = this.props

        const messageContent = this.isComment() ?
            (
                <div className="text-section">
                    <Field model="messageBox.message.body">
                        <textarea className="message-text only" tabIndex="2" placeholder="comment" autoFocus
                                  ref={ref => this.messageBody = ref} />
                    </Field>
                </div>
            ) :
            (
                <div className="text-section">
                    <Field model="messageBox.message.to">
                        <input type="email" className="message-recipients" tabIndex="1" placeholder="to" autoFocus
                               ref={ref => this.messageTo = ref}/>
                    </Field>
                    <Field model="messageBox.message.body">
                        <textarea className="message-text" tabIndex="2" placeholder="new message"/>
                    </Field>
                    <Field model="messageBox.message.subject">
                        <input type="text" className="message-subject" tabIndex="3" placeholder="subject" />
                    </Field>
                </div>
            )

        return (
            <div className="message-box">
                <Form model="messageBox" onSubmit={this.send}>
                    {messageContent}
                    <div className="send-section">
                        <button type="submit" className="send-button" tabIndex="4" disabled={messageBox.ongoingAction}>Send</button>
                    </div>
                </Form>
            </div>
        )
    }
}

MessageBox.propTypes = {
    messageBox: PropTypes.object.isRequired,
    thingContext: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        messageBox: state.messageBox,
        thingContext: state.thingPage.thing || {}
    }
}

module.exports = connect(mapStateToProps)(MessageBox)
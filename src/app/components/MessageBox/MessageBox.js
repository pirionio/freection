const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const {Form, Field} = require('react-redux-form')
const ReactDOM = require('react-dom');
const {isEmpty} = require('lodash')

const ThingActions = require('../../actions/thing-actions')

class NewPanel extends Component {
    constructor(props) {
        super(props)
        this.send = this.send.bind(this)
    }

    send() {
        const {messageBox, thingContext} = this.props

        if (this.isComment()) {
            this.props.createComment(thingContext.id, messageBox.message.body)
            this.messageBody.focus()
        } else {
            this.props.createNewThing(messageBox.message)
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
                        <button type="submit" tabIndex="4">Send</button>
                    </div>
                </Form>
            </div>
        )
    }
}

NewPanel.propTypes = {
    messageBox: PropTypes.object.isRequired,
    thingContext: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
    return {
        messageBox: state.messageBox,
        thingContext: state.showTask.task
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        createNewThing: (newMessage) => dispatch(ThingActions.createNewThing(newMessage)),
        createComment: (thingId, commentText) => dispatch(ThingActions.createComment(thingId, commentText))
    }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(NewPanel)
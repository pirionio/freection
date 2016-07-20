const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const {Form, Field} = require('react-redux-form')
const {isEmpty} = require('lodash')

const ThingActions = require('../../actions/thing-actions')

class NewPanel extends Component {
    constructor(props) {
        super(props)
        this.createNewThing = this.createNewThing.bind(this)
    }

    createNewThing() {
        const {newMessage, thingContext} = this.props

        if (this.isComment()) {
            this.props.createComment(thingContext.id, newMessage.body)
        } else {
            this.props.createNewThing(newMessage)
        }
    }

    isComment() {
        return !isEmpty(this.props.thingContext)
    }

    render () {
        const {newMessage} = this.props

        const messageContent = this.isComment() ?
            (
                <div className="text-section">
                    <Field model="newMessage.body">
                        <textarea className="message-text only" tabIndex="2" placeholder="comment"/>
                    </Field>
                </div>
            ) :
            (
                <div className="text-section">
                    <Field model="newMessage.to">
                        <input type="email" className="message-recipients" tabIndex="1" placeholder="to" />
                    </Field>
                    <Field model="newMessage.body">
                        <textarea className="message-text" tabIndex="2" placeholder="new message"/>
                    </Field>
                    <Field model="newMessage.subject">
                        <input type="text" className="message-subject" tabIndex="3" placeholder="subject" />
                    </Field>
                </div>
            )

        return (
            <div className="new-panel">
                <Form model="newMessage" onSubmit={this.createNewThing}>
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
    newMessage: PropTypes.object.isRequired,
    thingContext: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
    return {
        newMessage: state.newMessage,
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
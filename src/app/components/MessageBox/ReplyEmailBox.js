const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const {Form, Field} = require('react-redux-form')
const classAutobind = require('class-autobind').default
const {chain} = require('lodash/core')
const map = require('lodash/map')

const EmailCommandActions = require('../../actions/email-command-actions')

class ReplyEmailBox extends Component {
    constructor(props) {
        super(props)
        classAutobind(this)
    }

    send() {
        const {dispatch, replyEmailBox, thread} = this.props

        const toEmails = map(thread.to, 'payload.email')
        const lastMessage = chain(thread.messages).sortBy('createdAt').head().clone().value()

        dispatch(EmailCommandActions.replyToAll(thread.id, replyEmailBox.text, thread.subject, toEmails, lastMessage.id))
        this.messageText.focus()
    }

    render () {
        const {replyEmailBox} = this.props

        return (
            <div className="message-box">
                <Form model="replyEmailBox" onSubmit={this.send}>
                    <div className="text-section">
                        <Field model="replyEmailBox.text">
                        <textarea className="message-text only" tabIndex="2" placeholder="comment" autoFocus
                                  ref={ref => this.messageText = ref} />
                        </Field>
                    </div>
                    <div className="send-section">
                        <button type="submit" className="send-button" tabIndex="4" disabled={replyEmailBox.ongoingAction}>Send</button>
                    </div>
                </Form>
            </div>
        )
    }
}

ReplyEmailBox.propTypes = {
    replyEmailBox: PropTypes.object.isRequired,
    thread: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        replyEmailBox: state.replyEmailBox,
        thread: state.emailPage.thread || {}
    }
}

module.exports = connect(mapStateToProps)(ReplyEmailBox)
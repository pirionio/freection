const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const {Form, Field} = require('react-redux-form')
const classAutobind = require('class-autobind').default

const Flexbox = require('../UI/Flexbox')
const componentStyles = require('../component-styles')

const InlineMessageActions = require('../../actions/inline-message-actions')

class InlineMessage extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, InlineMessage.prototype)
    }

    send() {
        const {dispatch, inlineMessage} = this.props
        dispatch(InlineMessageActions.messageSent(inlineMessage))
    }
    
    isSendDisabled() {
        const {inlineMessage} = this.props
        return !inlineMessage.text
    }

    getLastComments() {
        const {expandedMessages} = this.props

        const styles = this.getStyles()

        return expandedMessages && expandedMessages.length ?
            <Flexbox name="last-comments" grow={1} container="column" style={styles.expandedMessages}>
                {expandedMessages.map(message =>
                    <Flexbox name="comment" style={styles.expandedMessages.message} key={message.id}>
                        <span>{message.payload.text}</span>
                    </Flexbox>
                )}
            </Flexbox> :
            null
    }

    getStyles() {
        return {
            container: {
                width: '100%',
                maxHeight: '295px'
            },
            form: {
                width: '100%',
                margin: 0
            },
            expandedMessages: {
                width: '100%',
                backgroundColor: '#fafafa',
                message: {
                    borderTop: '1px solid #e0e0e0',
                    padding: '30px 30px'
                }
            },
            message: {
                height: '70px',
                backgroundColor: 'white',
                borderTop: '1px solid #e0e0e0',
                padding: '0 30px'
            },
            textField: {
                width: '100%',
                border: 'none',
                outline: 'none',
                resize: 'none'
            }
        }
    }

    render() {
        const styles = this.getStyles()

        const lastMessage = this.getLastComments()

        return (
            <Flexbox name="inline-reply-container" container="column" style={styles.inlineMessage}>
                {lastMessage}
                <Form model="inlineMessage" onSubmit={this.send} style={styles.form}>
                    <Flexbox name="message" container="row" alignItems="center" style={styles.message}>
                        <Flexbox name="textarea" grow={1}>
                            <Field model="inlineMessage.text">
                                <input type="text" style={styles.textField} placeholder="You must write an explanation" autoFocus />
                            </Field>
                        </Flexbox>
                        <Flexbox name="send" style={componentStyles.sendButton}>
                            <button type="submit" disabled={this.isSendDisabled()}
                                    style={[componentStyles.sendButton.button, this.isSendDisabled() && componentStyles.sendButton.disabled]}>
                                Send
                            </button>
                        </Flexbox>
                    </Flexbox>
                </Form>
            </Flexbox>
        )
    }
}

InlineMessage.propTypes = {
    inlineMessage: PropTypes.object.isRequired,
    expandedMessages: PropTypes.array
}

function mapStateToProps(state) {
    return {
        inlineMessage: state.inlineMessage
    }
}

module.exports = connect(mapStateToProps)(InlineMessage)

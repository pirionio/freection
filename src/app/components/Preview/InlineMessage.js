import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Form, Field} from 'react-redux-form'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'
import classNames from 'classnames'

import Flexbox from '../UI/Flexbox'
import componentStyles from '../component-styles'
import * as InlineMessageActions from '../../actions/inline-message-actions'

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
        const {expandedMessages, sheet: {classes}} = this.props

        return expandedMessages && expandedMessages.length ?
            <Flexbox name="last-comments" grow={1} container="column" className={classes.expandedMessages}>
                {expandedMessages.map(message => {
                    return message && message.payload ?
                        <Flexbox name="comment" className={classes.singleMessage} key={message.id}>
                            <span>{message.payload.text}</span>
                        </Flexbox> :
                        null
                })}
            </Flexbox> :
            null
    }

    render() {
        const {sheet: {classes}} = this.props

        const lastMessage = this.getLastComments()

        const buttonClass = classNames(classes.sendButton, this.isSendDisabled() && classes.disabledSendButton)
        
        return (
            <Flexbox name="inline-reply-container" container="column" className={classes.inlineMessage}>
                {lastMessage}
                <Form model="inlineMessage" onSubmit={this.send} className={classes.form}>
                    <Flexbox name="message" container="row" alignItems="center" className={classes.messageBox}>
                        <Flexbox name="textarea" grow={1}>
                            <Field model="inlineMessage.text">
                                <input type="text" className={classes.textField} placeholder="You must write an explanation" autoFocus />
                            </Field>
                        </Flexbox>
                        <Flexbox name="send" className={classes.sendButtonContainer}>
                            <button type="submit" disabled={this.isSendDisabled()} className={buttonClass}>
                                Send
                            </button>
                        </Flexbox>
                    </Flexbox>
                </Form>
            </Flexbox>
        )
    }
}

const style = Object.assign({
    container: {
        width: '100%',
        maxHeight: 295
    },
    form: {
        width: '100%',
        margin: 0
    },
    expandedMessages: {
        width: '100%',
        backgroundColor: '#fafafa'
    },
    singleMessage: {
        borderTop: '1px solid #e0e0e0',
        padding: 30
    },
    messageBox: {
        height: 70,
        backgroundColor: 'white',
        borderTop: '1px solid #e0e0e0',
        padding: [0, 30]
    },
    textField: {
        width: '100%',
        border: 'none',
        outline: 'none',
        resize: 'none'
    }
}, componentStyles)

InlineMessage.propTypes = {
    inlineMessage: PropTypes.object.isRequired,
    expandedMessages: PropTypes.array
}

function mapStateToProps(state) {
    return {
        inlineMessage: state.inlineMessage
    }
}

export default useSheet(connect(mapStateToProps)(InlineMessage), style)

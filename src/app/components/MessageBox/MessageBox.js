import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Field} from 'react-redux-form'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'
import isNil from 'lodash/isNil'

import Flexbox from '../UI/Flexbox'
import MessageBody from './MessageBody'
import To from './To'
import styleVars from '../style-vars'
import * as MessageBoxActions from '../../actions/message-box-actions'

class MessageBox extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, MessageBox.prototype)
    }

    componentDidMount() {
        this.focus()
    }

    componentDidUpdate(prevProps) {
        if (prevProps && prevProps.messageBox && this.props && this.props.messageBox &&
            (prevProps.messageBox.id !== this.props.messageBox.id) ||
            (prevProps.messageBox.message !== this.props.messageBox.message)) {

            this.focus()
        }
    }

    focus() {
        const focusOnField = this.props.messageBox.focusOn

        let focusOn = this[focusOnField]

        if (!focusOn) {
            focusOn = this.hasSubject() ? this.messageSubject : this.messageBody
        }

        // This timeout seems to be essential in order to make the focus of the draft-js, in the MessageBody, work.
        // Here is an issue about it: https://github.com/draft-js-plugins/draft-js-plugins/issues/357.
        // I guess there's something internal in the component that needs to be initialized before the focus occurs.
        setTimeout(() => {
            focusOn && focusOn.focus && focusOn.focus()
        })
    }

    getSubject() {
        const {sheet: {classes}} = this.props

        if (!this.hasSubject())
            return null

        return (
            <Flexbox name="message-subject" className={classes.messageSubject}>
                <Field model="messageBox.message.subject">
                    <input type="text" className={classes.textField} tabIndex="1" placeholder="Subject"
                           ref={ref => this.messageSubject = ref}
                           onFocus={this.focusOnSubject} />
                </Field>
            </Flexbox>
        )
    }

    getBody() {
        const {sheet: {classes}} = this.props

        const bodyClass = (!this.hasSubject() && !this.hasTo()) ? classes.bodyOnly : null
        return (
            <MessageBody className={bodyClass} onFocus={this.focusOnBody} tabIndex="2" editorRef={ref => this.messageBody = ref} />
        )
    }

    getTo() {
        const {sheet: {classes}} = this.props

        if (!this.hasTo())
            return null

        return <To model="messageBox.message"
                   containerClassName={classes.messageTo}
                   inputClassName={classes.textField}
                   tabIndex={3}
                   inputRef={ref => this.messageTo = ref}
                   onFocus={this.focusOnTo}
                   placeholder="To" />
    }

    focusOnSubject() {
        const {dispatch, messageBox} = this.props
        dispatch(MessageBoxActions.setFocus(messageBox.id, 'messageSubject'))
    }

    focusOnBody() {
        const {dispatch, messageBox} = this.props
        dispatch(MessageBoxActions.setFocus(messageBox.id, 'messageBody'))
    }

    focusOnTo() {
        const {dispatch, messageBox} = this.props
        dispatch(MessageBoxActions.setFocus(messageBox.id, 'messageTo'))
    }

    hasSubject() {
        return !isNil(this.props.subject)
    }

    hasTo() {
        return !isNil(this.props.to)
    }

    render () {
        const {sheet: {classes}} = this.props

        const subject = this.getSubject()
        const body = this.getBody()
        const to = this.getTo()

        return (
            <Flexbox name="message-text" grow={1} className={classes.box} container="column">
                {subject}
                {body}
                {to}
            </Flexbox>
        )
    }
}

const style = {
    box: {
        height: 235,
        padding: [30, 30, 20],
        backgroundColor: 'white',
        border: `1px solid ${styleVars.highlightColor}`
    },
    messageSubject: {
        width: '100%',
        marginBottom: 30,
        fontWeight: 'bold'
    },
    messageTo: {
        width: 'calc(100% - 108px)',
        marginTop: 30,
        '&:-webkit-autofill': {
            backgroundColor: 'inherit'
        }
    },
    textField: {
        width: '100%',
        border: 'none',
        outline: 'none',
        resize: 'none',
        letterSpacing: styleVars.messageLetterSpacing
    },
    bodyOnly: {
        height: 132
    }
}

MessageBox.propTypes = {
    messageBox: PropTypes.object.isRequired,
    subject: PropTypes.string,
    to: PropTypes.string
}

function mapStateToProps(state) {
    return {
        messageBox: state.messageBox
    }
}

export default useSheet(connect(mapStateToProps)(MessageBox), style)

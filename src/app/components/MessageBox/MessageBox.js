const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const {Field} = require('react-redux-form')
const classAutobind = require('class-autobind').default
const useSheet = require('react-jss').default

const isNil = require('lodash/isNil')
const find = require('lodash/find')

const Flexbox = require('../UI/Flexbox')
const To = require('./To')
const styleVars = require('../style-vars')

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

        focusOn && focusOn.focus()
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

        return (
            <Flexbox name="message-body" grow={1} container="row" className={classes.messageBody}>
                <Field model="messageBox.message.body">
                    <textarea className={classes.textField} tabIndex="2" placeholder="Write your message here"
                              ref={ref => this.messageBody = ref}
                              onFocus={this.focusOnBody} />
                </Field>
            </Flexbox>
        )
    }

    getTo() {
        const {sheet: {classes}} = this.props

        if (!this.hasTo())
            return null

        return <To model="messageBox.message.to"
                   containerClassName={classes.messageTo}
                   inputClassName={classes.textField}
                   tabIndex={3}
                   inputRef={ref =>this.messageTo = ref}
                   onFocus={this.focusOnTo} />
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
        height: 200,
        backgroundColor: 'white',
        border: `1px solid ${styleVars.highlightColor}`
    },
    messageSubject: {
        height: 40,
        width: '100%',
        padding: [10, 10, 0]
    },
    messageTo: {
        height: 40,
        width: 'calc(100% - 108px)',
        padding: [10, 10, 0],
        '&:-webkit-autofill': {
            backgroundColor: 'inherit'
        }
    },
    messageBody: {
        padding: 10
    },
    textField: {
        width: '100%',
        border: 'none',
        outline: 'none',
        resize: 'none'
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

module.exports = useSheet(connect(mapStateToProps)(MessageBox), style)

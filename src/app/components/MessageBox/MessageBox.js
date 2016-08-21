const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const {Field} = require('react-redux-form')
const classAutobind = require('class-autobind').default
const radium = require('radium')

const isNil = require('lodash/isNil')
const find = require('lodash/find')

const Flexbox = require('../UI/Flexbox')
const To = require('./To')
const styleVars = require('../style-vars')

const MessageBoxActions = require('../../actions/message-box-actions')

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
        const styles = this.getStyles()

        if (!this.hasSubject())
            return null

        return (
            <Flexbox name="message-subject" style={styles.messageSubject}>
                <Field model="messageBox.message.subject">
                    <input type="text" style={[styles.textField]} tabIndex="1" placeholder="Subject"
                           ref={ref => this.messageSubject = ref}
                           onFocus={this.focusOnSubject} />
                </Field>
            </Flexbox>
        )
    }

    getBody() {
        const styles = this.getStyles()

        return (
            <Flexbox name="message-body" grow={1} container="row" style={styles.messageBody}>
                <Field model="messageBox.message.body">
                    <textarea style={styles.textField} tabIndex="2" placeholder="Wrtie your message here"
                              ref={ref => this.messageBody = ref}
                              onFocus={this.focusOnBody} />
                </Field>
            </Flexbox>
        )
    }

    getTo() {
        const styles = this.getStyles()

        if (!this.hasTo())
            return null

        return <To model="messageBox.message.to"
                   containerStyle={styles.messageTo}
                   inputStyle={styles.textField}
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

    getStyles() {
        return {
            box: {
                height: '200px',
                backgroundColor: 'white',
                border: `1px solid ${styleVars.highlightColor}`,
                boxShadow: '0px 0px 40px 0px rgba(0, 0, 0, 0.2)'
            },
            messageSubject: {
                height: '40px',
                width: '100%',
                padding: '10px 10px 0'
            },
            messageTo: {
                height: '40px',
                width: 'calc(100% - 108px)',
                padding: '10px 10px 0',
                ':-webkit-autofill': {
                    backgroundColor: 'inherit'
                }
            },
            messageBody: {
                padding: '10px 10px'
            },
            textField: {
                width: '100%',
                border: 'none',
                outline: 'none',
                resize: 'none'
            }
        }
    }

    render () {
        const styles = this.getStyles()

        const subject = this.getSubject()
        const body = this.getBody()
        const to = this.getTo()

        return (
            <Flexbox name="message-text" grow={1} style={styles.box} container="column">
                {subject}
                {body}
                {to}
            </Flexbox>
        )
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

module.exports = connect(mapStateToProps)(radium(MessageBox))

const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const {Form, Field} = require('react-redux-form')
const classAutobind = require('class-autobind').default
const isNil = require('lodash/isNil')

const Flexbox = require('../UI/Flexbox')
const styleVars = require('../style-vars')

class MessageBox extends Component {
    constructor(props) {
        super(props)
        classAutobind(thi, MessageBox.prototype)
    }

    getSubject() {
        const styles = this.getStyles()

        if (isNil(this.props.subject))
            return null

        return (
            <Flexbox name="message-subject" style={styles.messageSubject}>
                <Field model="messageBox.message.subject">
                    <input type="text" style={styles.textField} tabIndex="1" placeholder="Subject" autoFocus />
                </Field>
            </Flexbox>
        )
    }

    getBody() {
        const styles = this.getStyles()

        return (
            <Flexbox name="message-body" grow={1} container={true} style={styles.messageBody}>
                <Field model="messageBox.message.body">
                    <textarea style={styles.textField} tabIndex="2" placeholder="Wrtie your message here" />
                </Field>
            </Flexbox>
        )
    }

    getTo() {
        const styles = this.getStyles()

        if (isNil(this.props.to))
            return null

        return (
            <Flexbox name="message-to" style={styles.messageTo}>
                <Field model="messageBox.message.to">
                    <input type="text" style={styles.textField} tabIndex="3" placeholder="To" />
                </Field>
            </Flexbox>
        )
    }

    getStyles() {
        return {
            box: {
                height: '200px',
                backgroundColor: 'white',
                border: `1px solid ${styleVars.primaryColor}`
            },
            messageSubject: {
                height: '40px',
                width: '100%',
                padding: '10px 10px 0'
            },
            messageTo: {
                height: '40px',
                width: 'calc(100% - 70px)',
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

module.exports = connect(mapStateToProps)(MessageBox)

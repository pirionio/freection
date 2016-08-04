const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const {Form, Field} = require('react-redux-form')
const classAutobind = require('class-autobind').default

const ThingCommandActions = require('../../actions/thing-command-actions')

class MessageBox extends Component {
    constructor(props) {
        super(props)
        classAutobind(this)
    }

    send() {
        const {dispatch, newThingBox} = this.props
        dispatch(ThingCommandActions.newThing(newThingBox.message))
        this.messageTo.focus()
    }

    render () {
        const {newThingBox} = this.props

        return (
            <div className="message-box">
                <Form model="newThingBox" onSubmit={this.send}>
                    <div className="text-section">
                        <Field model="newThingBox.message.to">
                            <input type="email" className="message-recipients" tabIndex="1" placeholder="to" autoFocus
                                   ref={ref => this.messageTo = ref}/>
                        </Field>
                        <Field model="newThingBox.message.body">
                            <textarea className="message-text" tabIndex="2" placeholder="new message"/>
                        </Field>
                        <Field model="newThingBox.message.subject">
                            <input type="text" className="message-subject" tabIndex="3" placeholder="subject" />
                        </Field>
                    </div>
                    <div className="send-section">
                        <button type="submit" className="send-button" tabIndex="4" disabled={newThingBox.ongoingAction}>Send</button>
                    </div>
                </Form>
            </div>
        )
    }
}

MessageBox.propTypes = {
    newThingBox: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        newThingBox: state.newThingBox
    }
}

module.exports = connect(mapStateToProps)(MessageBox)
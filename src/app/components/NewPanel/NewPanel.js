const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const {Form, Field} = require('react-redux-form')

const ThingHelper = require('../../helpers/new-thing-helper')

class NewPanel extends Component {
    constructor(props) {
        super(props)
        this.createNewThing = this.createNewThing.bind(this)
    }

    createNewThing() {
        ThingHelper.createNewThing(this.props.dispatch, this.props.newThing)
    }

    render () {
        const {newThing} = this.props
        return (
            <Form model="newThing" onSubmit={this.createNewThing}>
                <div className="new-panel">
                    <div className="text-section">
                        <Field model="newThing.to">
                            <input type="email" className="message-recipients" tabIndex="1" placeholder="to" />
                        </Field>
                        <Field model="newThing.body">
                            <textarea className="message-text" tabIndex="2" placeholder="message"/>
                        </Field>
                        <Field model="newThing.subject">
                            <input type="text" className="message-subject" tabIndex="3" placeholder="subject" />
                        </Field>
                    </div>
                    <div className="send-section">
                        <button type="submit" tabIndex="4">Send</button>
                    </div>
                </div>
            </Form>
        )
    }
}

NewPanel.propTypes = {
    newThing: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
    return {
        newThing: state.newThing
    }
}

module.exports = connect(mapStateToProps)(NewPanel)
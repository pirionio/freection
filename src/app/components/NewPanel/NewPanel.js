const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')

const NewThingActions = require('../../actions/new-thing-actions')

class NewPanel extends Component {
    constructor(props) {
        super(props)
        this.state = props.thing
        this.createNewThing = this.createNewThing.bind(this)
        this.handleRecipientChange = this.handleRecipientChange.bind(this)
        this.handleBodyChange = this.handleBodyChange.bind(this)
        this.handleSubjectChange = this.handleSubjectChange.bind(this)
    }

    createNewThing() {
        this.props.createNewThing(this.state)
        this.setState({to: null, body: null, subject: null})
    }

    handleRecipientChange(event) {
        this.setState({to: event.target.value})
    }

    handleBodyChange(event) {
        this.setState({body: event.target.value})
    }

    handleSubjectChange(event) {
        this.setState({subject: event.target.value})
    }

    render () {
        const {thing} = this.props
        return (
            <div className="new-panel">
                <div className="text-section">
                    <input className="message-recipients" tabIndex="1" placeholder="to" value={thing.to}
                           onChange={this.handleRecipientChange} />
                    <textarea className="message-text" tabIndex="2" placeholder="message" value={thing.body}
                              onChange={this.handleBodyChange}/>
                    <input className="message-subject" tabIndex="3" placeholder="subject" value={thing.subject}
                           onChange={this.handleSubjectChange}/>
                </div>
                <div className="send-section">
                    <button onClick={this.createNewThing}>Send</button>
                </div>
            </div>
        )
    }
}

NewPanel.propTypes = {
    thing: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
    return {
        thing: state.newThing.thing
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        createNewThing: (thing) => dispatch(NewThingActions.createNewThing(thing))
    }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(NewPanel)
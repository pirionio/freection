const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const {Form, Field} = require('react-redux-form')
const classAutobind = require('class-autobind').default

const ThingCommandActions = require('../../actions/thing-command-actions')

class CommentThingBox extends Component {
    constructor(props) {
        super(props)
        classAutobind(this)
    }

    send() {
        const {dispatch, commentThingBox, thing} = this.props
        dispatch(ThingCommandActions.comment(thing.id, commentThingBox.text))
        this.messageText.focus()
    }

    render () {
        const {commentThingBox} = this.props

        return (
            <div className="message-box">
                <Form model="commentThingBox" onSubmit={this.send}>
                    <div className="text-section">
                        <Field model="commentThingBox.text">
                        <textarea className="message-text only" tabIndex="2" placeholder="comment" autoFocus
                                  ref={ref => this.messageText = ref} />
                        </Field>
                    </div>
                    <div className="send-section">
                        <button type="submit" className="send-button" tabIndex="4" disabled={commentThingBox.ongoingAction}>Send</button>
                    </div>
                </Form>
            </div>
        )
    }
}

CommentThingBox.propTypes = {
    commentThingBox: PropTypes.object.isRequired,
    thing: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        commentThingBox: state.commentThingBox,
        thing: state.thingPage.thing || {}
    }
}

module.exports = connect(mapStateToProps)(CommentThingBox)
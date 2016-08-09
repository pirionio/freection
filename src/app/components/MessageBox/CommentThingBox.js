const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const {Form, Field} = require('react-redux-form')
const classAutobind = require('class-autobind').default

const ThingCommandActions = require('../../actions/thing-command-actions')

const Flexbox = require('../UI/Flexbox')
const Button = require('../UI/Button')
const styleVars = require('../style-vars')

class CommentThingBox extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, CommentThingBox.prototype)
    }

    send() {
        const {dispatch, commentThingBox, thing} = this.props
        dispatch(ThingCommandActions.comment(thing.id, commentThingBox.text))
        this.messageText.focus()
    }

    getStyles() {
        return {
            form: {
                width: '100%'
            },
            panel: {
                height: '200px'
            },
            box: {
                position: 'relative'
            },
            topBar: {
                height: '40px',
                backgroundColor: styleVars.primaryColor
            },
            boxText: {
                backgroundColor: 'white',
                border: `1px solid ${styleVars.primaryColor}`
            },
            messageBody: {
                padding: '10px 10px',
                width: 'calc(100% - 70px)'
            },
            textField: {
                width: '100%',
                border: 'none',
                outline: 'none',
                resize: 'none'
            },
            send: {
                position: 'absolute',
                width: '60px',
                bottom: '40px',
                right: '60px',
                border: `1px solid ${styleVars.primaryColor}`,
                button: {
                    height: '30px',
                    width: '100%',
                    padding: '0',
                    margin: '0',
                    border: 'none',
                    backgroundColor: styleVars.primaryColor,
                    color: 'white',
                    ':focus':{
                        outlineColor: styleVars.secondaryColor
                    },
                    ':hover': {
                        cursor: 'pointer',
                        color: styleVars.secondaryColor
                    }

                }
            }
        }
    }

    render () {
        const {commentThingBox} = this.props

        const styles = this.getStyles()

        return (
            <Form model="commentThingBox" onSubmit={this.send} style={styles.form}>
                <Flexbox name="message-panel" container="row" style={styles.panel}>
                    <Flexbox name="message-box" grow={1} container="column" style={styles.box}>
                        <Flexbox name="message-box-top-bar" style={styles.topBar} />
                        <Flexbox name="message-text" grow={1} style={styles.boxText} container="column">
                            <Flexbox name="message-body" grow={1} container={true} style={styles.messageBody}>
                                <Field model="commentThingBox.text">
                                    <textarea style={styles.textField} tabIndex="1" placeholder="Write your message here"
                                              ref={ref => this.messageText = ref} autoFocus />
                                </Field>
                            </Flexbox>
                        </Flexbox>
                    </Flexbox>
                    <div name="send-container" style={styles.send}>
                        <Button type="submit" label="Send" style={styles.send.button} tabIndex="2" disabled={commentThingBox.ongoingAction} />
                    </div>
                </Flexbox>
            </Form>
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
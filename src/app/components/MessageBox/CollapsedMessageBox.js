const React = require('react')
const {Component, PropTypes} = React
const classAutobind = require('class-autobind').default
const {connect} = require('react-redux')

const MessageBoxActions = require('../../actions/message-box-actions')
const MessageTypes = require('../../../common/enums/message-types')

const Flexbox = require('../UI/Flexbox')
const styleVars = require('../style-vars')

class CollapsedMessageBox extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, CollapsedMessageBox.prototype)
    }

    newThingMessageBox() {
        const {dispatch} = this.props
        dispatch(MessageBoxActions.newMessage(MessageTypes.NEW_THING))
    }

    getStyles() {
        return {
            box: {
                height: '70px',
                backgroundColor: 'white',
                border: `1px solid ${styleVars.primaryColor}`
            },
            placeholder: {
                paddingLeft: '10px',
                color: styleVars.watermarkColor
            }
        }
    }

    render () {
        const styles = this.getStyles()

        return (
            <Flexbox name="message-text" container="column" justifyContent="center" style={styles.box}>
                <span style={styles.placeholder} onClick={this.newThingMessageBox}>
                    Create a new Thing by typing here
                </span>
            </Flexbox>
        )
    }
}

module.exports = connect()(CollapsedMessageBox)

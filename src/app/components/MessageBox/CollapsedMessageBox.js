const React = require('react')
const {Component, PropTypes} = React
const classAutobind = require('class-autobind').default
const {connect} = require('react-redux')
const radium = require('radium')

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
        dispatch(MessageBoxActions.newMessageBox(MessageTypes.NEW_THING))
    }

    getStyles() {
        return {
            box: {
                height: '70px',
                backgroundColor: '#fafafa',
                opacity: '0.5',
                boxShadow: '0px 0px 40px 0px rgba(0, 0, 0, 0.2)',
                ':hover': {
                    opacity: '1'
                }
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
                    Create a new Thing by typing here.
                </span>
            </Flexbox>
        )
    }
}

module.exports = connect()(radium(CollapsedMessageBox))

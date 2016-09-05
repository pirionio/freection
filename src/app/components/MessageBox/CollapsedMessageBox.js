const React = require('react')
const {Component} = React
const classAutobind = require('class-autobind').default
const {connect} = require('react-redux')
const useSheet = require('react-jss').default

const MessageBoxActions = require('../../actions/message-box-actions')
import MessageTypes from '../../../common/enums/message-types'

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

    render () {
        const {sheet: {classes}} = this.props
        
        return (
            <Flexbox name="message-text" container="column" justifyContent="center" onClick={this.newThingMessageBox} className={classes.box}>
                <span className={classes.placeholder}>
                    Create a new Thing by typing here.
                </span>
            </Flexbox>
        )
    }
}

const style = {
    box: {
        height: '70px',
        backgroundColor: '#fafafa',
        opacity: '0.5',
        cursor: 'text',
        ':hover': {
            opacity: '1'
        }
    },
    placeholder: {
        paddingLeft: '10px',
        color: styleVars.watermarkColor
    }
}

module.exports = useSheet(connect()(CollapsedMessageBox), style)

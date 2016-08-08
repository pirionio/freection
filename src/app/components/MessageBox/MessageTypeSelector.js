const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const radium = require('radium')
const classAutobind = require('class-autobind').default

const Flexbox = require('../UI/Flexbox')
const MessageBoxActions = require('../../actions/message-box-actions')
const MessageTypes = require('../../../common/enums/message-types')

class MessageTypeSelector extends Component {
    constructor(props) {
        super(props)
        classAutobind(this)
    }

    selectThing() {
        const {dispatch} = this.props
        dispatch(MessageBoxActions.selectOption(MessageTypes.NEW_THING))
    }

    selectEmail() {
        const {dispatch} = this.props
        dispatch(MessageBoxActions.selectOption(MessageTypes.NEW_EMAIL))
    }

    render() {
        const optionStyles = {
            base: {
                display: 'block',
                width: '100%',
                height: '55'
            },
            thing: {
                backgroundColor: this.props.selectedOption === MessageTypes.NEW_THING ? '#eff3ca' : undefined
            },
            email: {
                backgroundColor: this.props.selectedOption === MessageTypes.NEW_EMAIL ? '#eff3ca' : undefined
            }
        }

        return (
            <Flexbox container="column" justifyContent="space-between" height="100%">
                <Flexbox>
                    <input type="button" style={[optionStyles.base, optionStyles.thing]} onClick={this.selectThing} value="Thing" />
                </Flexbox>
                <Flexbox>
                    <input type="button" style={[optionStyles.base, optionStyles.email]} onClick={this.selectEmail} value="Email" />
                </Flexbox>
            </Flexbox>
        )
    }
}

MessageTypeSelector.propTypes = {
    selectedOption: PropTypes.string.isRequired
}

function mapStateToProps(state) {
    return {
        selectedOption: state.newMessageBox.selectedOption
    }
}

module.exports = connect(mapStateToProps)(radium(MessageTypeSelector))
const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const classnames = require('classnames')
const classAutobind = require('class-autobind').default

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
        const thingOptionClasses = classnames('option', {
            'selected': this.props.selectedOption === MessageTypes.NEW_THING
        })

        const emailOptionClasses = classnames('option', {
            'selected': this.props.selectedOption === MessageTypes.NEW_EMAIL
        })

        return (
            <div className="message-type-selector">
                <input type="button" className={thingOptionClasses} onClick={this.selectThing} value="Thing" />
                <input type="button" className={emailOptionClasses} onClick={this.selectEmail} value="Email" />
            </div>
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

module.exports = connect(mapStateToProps)(MessageTypeSelector)
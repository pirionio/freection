const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const radium = require('radium')
const classAutobind = require('class-autobind').default

const Flexbox = require('../UI/Flexbox')
const MessageBoxActions = require('../../actions/message-box-actions')
const MessageTypes = require('../../../common/enums/message-types')

const styleVars = require('../style-vars')

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
        const {selectedOption} = this.props

        const styles = {
            selector: {
                height: '100%'
            },
            option: {
                width: '100%',
                height: '50%',
                border: 'none',
                outline: 'none',
                backgroundColor: styleVars.primaryColor,
                color: 'white',
                ':hover': {
                    cursor: 'pointer',
                    color: styleVars.secondaryColor
                },
                selected: {
                    backgroundColor: styleVars.secondaryColor,
                    color: styleVars.primaryColor,
                    ':hover': {
                        color: styleVars.primaryColor,
                    }
                }
            }
        }

        return (
            <Flexbox container="column" style={styles.selector}>
                <Flexbox>
                    <button type="button" style={[styles.option, selectedOption === MessageTypes.NEW_THING ? styles.option.selected : {}]}
                            onClick={this.selectThing}>
                        New Thing
                    </button>
                </Flexbox>
                <Flexbox>
                    <button type="button" style={[styles.option, selectedOption === MessageTypes.NEW_EMAIL ? styles.option.selected : {}]}
                            onClick={this.selectEmail}>
                        New Email
                    </button>
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
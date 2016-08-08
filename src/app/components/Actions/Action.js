const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const classAutobind = require('class-autobind').default
const radium = require('radium')

const styleVars = require('../style-vars')

class Action extends Component {
    constructor(props) {
        super(props)
        classAutobind(this)
    }

    doAction() {
        const {dispatch, doFunc, item} = this.props
        dispatch(doFunc(item))
    }
    
    render () {
        const {label, disabled} = this.props
        const buttonStyle = {
            marginLeft: '28px',
            border: 'none',
            backgroundColor: styleVars.primaryColor,
            color: 'white',
            textTransform: 'uppercase',
            fontWeight: '600',
            fontSize: '12px',
            height: '27px',
            padding: '8px 16px',
            cursor: 'hand',

            ':focus':{
                outline: 'none',
            },

            ':hover': {
                color: styleVars.secondaryColor
            }
        }

        return (
            <button style={buttonStyle} onClick={this.doAction} disabled={disabled}>{label}</button>
        )
    }
}

Action.propTypes = {
    label: PropTypes.string.isRequired,
    item: PropTypes.any.isRequired,
    doFunc: PropTypes.func.isRequired,
    disabled: PropTypes.bool
}

Action.defaultProps = {
    disabled: false
}

module.exports = connect()(radium(Action))
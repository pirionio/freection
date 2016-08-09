const React = require('react')
const {Component, PropTypes} = React
const radium = require('radium')

const styleVars = require('../style-vars')

class Button extends Component {
    render() {
        const {label, onClick, disabled, type, style} = this.props

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
            <button type={type} style={[buttonStyle, style]} onClick={onClick} disabled={disabled}>{label}</button>
        )
    }
}

Button.propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    type: PropTypes.string,
    style: PropTypes.object
}

Button.defaultProps = {
    disabled: false,
    type: 'text'
}

module.exports = radium(Button)
const React = require('react')
const {Component, PropTypes} = React

const styleVars = require('../style-vars')

class Button extends Component {
    render() {
        const {label, onClick, disabled, type, style, tabIndex} = this.props

        const buttonStyle = {
            margin: '0 0 0 28px',
            border: `1px solid ${styleVars.secondaryColor}`,
            backgroundColor: 'rgba(0, 0, 0, 0)',
            textTransform: 'uppercase',
            fontWeight: '500',
            fontSize: '0.75em',
            height: '27px',
            padding: '8px 16px',
            cursor: 'hand',

            ':focus':{
                outline: 'none',
            },

            ':hover': {
                backgroundColor: styleVars.secondaryColor,
                color: 'white'
            }
        }

        return (
            <button type={type} style={[buttonStyle, style]} onClick={onClick} disabled={disabled} tabIndex={tabIndex}>{label}</button>
        )
    }
}

Button.propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    type: PropTypes.string,
    style: PropTypes.object,
    tabIndex: PropTypes.string
}

Button.defaultProps = {
    disabled: false,
    type: 'text'
}

module.exports = Button
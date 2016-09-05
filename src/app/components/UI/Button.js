const React = require('react')
const {Component, PropTypes} = React
const useSheet = require('react-jss').default

const styleVars = require('../style-vars')

class Button extends Component {
    render() {
        const {label, onClick, disabled, type, tabIndex, sheet: {classes}} = this.props

        return (
            <button type={type} className={classes.button} onClick={onClick} disabled={disabled} tabIndex={tabIndex}>{label}</button>
        )
    }
}

const style = {
    button: {
        margin: [0, 0, 0, 28],
        border: `1px solid ${styleVars.secondaryColor}`,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        textTransform: 'uppercase',
        fontWeight: '500',
        fontSize: '0.75em',
        height: 27,
        padding: [8, 16],
        cursor: 'hand',
        '&:focus':{
            outline: 'none',
        },
        '&:hover': {
            backgroundColor: styleVars.secondaryColor,
            color: 'white'
        }
    }
}

Button.propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    type: PropTypes.string,
    tabIndex: PropTypes.string
}

Button.defaultProps = {
    disabled: false,
    type: 'text'
}

module.exports = useSheet(Button, style)
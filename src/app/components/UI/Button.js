import React, {Component, PropTypes} from 'react'
import useSheet from 'react-jss'
import classNames from 'classnames'

import styleVars from '../style-vars'

class Button extends Component {
    render() {
        const {label, onClick, disabled, type, tabIndex, sheet: {classes}} = this.props

        // The 'js-button' class is provided in order to let parent components override styles of this button.
        const buttonClasses = classNames(classes.button, 'js-button')

        return (
            <button type={type} className={buttonClasses} onClick={onClick} disabled={disabled} tabIndex={tabIndex}>{label}</button>
        )
    }
}

const style = {
    button: {
        margin: [0, 0, 0, 20],
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

export default useSheet(Button, style)
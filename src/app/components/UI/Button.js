import React, {Component, PropTypes} from 'react'
import useSheet from 'react-jss'
import classNames from 'classnames'
import random from 'lodash/random'

import Tooltip from './Tooltip'
import styleVars from '../style-vars'

class Button extends Component {
    render() {
        const {label, onClick, disabled, type, tabIndex, tooltipText, sheet: {classes}} = this.props

        // The 'js-button' class is provided in order to let parent components override styles of this button.
        const buttonClasses = classNames(classes.button, 'js-button')

        if (tooltipText) {
            const tooltipId = `tooltip-${random(Number.MAX_SAFE_INTEGER)}`
            return (
                <div>
                    <button type={type} className={buttonClasses} onClick={onClick} disabled={disabled} tabIndex={tabIndex} data-tip
                            data-for={tooltipId}>
                        {label}
                    </button>
                    <Tooltip id={tooltipId} text={tooltipText} place="right" className={classes.tooltip} />
                </div>
            )
        }

        return (
            <button type={type} className={buttonClasses} onClick={onClick} disabled={disabled} tabIndex={tabIndex}>
                {label}
            </button>
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
    },
    tooltip: {
        display: 'block',
        maxWidth: 300,
        whiteSpace: 'pre-line',
        lineHeight: 1.5,
        padding: [5, 10],
        opacity: '0.5 !important',
        backgroundColor: `${styleVars.primaryColor} !important`,
        '& :after': {
            borderTopColor: `${styleVars.primaryColor} !important`,
            opacity: '0.5 !important'
        }
    }
}

Button.propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    type: PropTypes.string,
    tabIndex: PropTypes.string,
    tooltipText: PropTypes.string
}

Button.defaultProps = {
    disabled: false,
    type: 'text'
}

export default useSheet(Button, style)
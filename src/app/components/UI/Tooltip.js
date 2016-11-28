import React, {PropTypes, Component} from 'react'
import ReactTooltip from 'react-tooltip'
import useSheet from 'react-jss'

import styleVars from '../style-vars'
import {GeneralConstants} from '../../constants'

class Tooltip extends Component {
    render() {
        const {id, type, delay, multiline, place, children, text, className, sheet: {classes}} = this.props

        const content =
            children ? children :
            text ? text :
            null

        return (
            <ReactTooltip id={id} type={type} effect="solid" delayShow={delay} multiline={multiline} place={place} class={className || classes.tooltip}>
                {content}
            </ReactTooltip>
        )
    }
}

const style = {
    tooltip: {
        display: 'block',
        maxWidth: 500,
        maxHeight: 150,
        whiteSpace: 'pre-line',
        lineHeight: 2,
        backgroundColor: `${styleVars.primaryColor} !important`,
        '& :after': {
            borderTopColor: `${styleVars.primaryColor} !important`
        }
    }
}

Tooltip.propTypes = {
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    delay: PropTypes.number.isRequired,
    multiline: PropTypes.bool.isRequired,
    place: PropTypes.string.isRequired,
    text: PropTypes.string,
    className: PropTypes.string
}

Tooltip.defaultProps = {
    type: 'dark',
    delay: GeneralConstants.TOOLTIP_DELAY,
    multiline: true,
    place: 'top'
}

export default useSheet(Tooltip, style)
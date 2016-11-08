import React, {PropTypes, Component} from 'react'
import ReactDOM from 'react-dom'
import useSheet from 'react-jss'
import classAutobind from 'class-autobind'
import classNames from 'classnames'
import random from 'lodash/random'

import Tooltip from './Tooltip'

class TextTruncate extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, TextTruncate.prototype)

        this.state = {
            overflows: false
        }
    }

    componentDidMount() {
        if (this.text) {
            const containerNode = ReactDOM.findDOMNode(this)
            const textNode = ReactDOM.findDOMNode(this.text)

            // We want to know if the text really overflows its container, in order to set a tooltip only in this case.
            if (containerNode && textNode && textNode.offsetWidth > containerNode.offsetWidth) {
                this.setState({
                    overflows: true
                })
            }
        }
    }

    getTextClass() {
        const {className, sheet: {classes}} = this.props
        return classNames(classes.base, className)
    }

    renderTextWithTooltip() {
        const {children, sheet: {classes}} = this.props

        const tooltipId = `tooltip-${random(Number.MAX_SAFE_INTEGER)}`
        const textTruncateClass = this.getTextClass()

        return (
            <div name="text-truncate" className={textTruncateClass} data-tip data-for={tooltipId}>
                <span ref={ref => this.text = ref}>
                    {children}
                </span>
                <Tooltip id={tooltipId}>
                    {children}
                </Tooltip>
            </div>
        )
    }

    render() {
        const {children, tooltip} = this.props

        const textTruncateClass = this.getTextClass()

        if (tooltip && this.state.overflows)
            return this.renderTextWithTooltip()

        return (
            <div name="text-truncate" className={textTruncateClass}>
                <span ref={ref => this.text = ref}>
                    {children}
                </span>
            </div>
        )
    }
}

const style = {
    base: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    }
}

TextTruncate.propTypes = {
    className: PropTypes.string,
    tooltip: PropTypes.bool.isRequired
}

TextTruncate.defaultProps = {
    tooltip: false
}

export default useSheet(TextTruncate, style)
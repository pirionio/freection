import React, {PropTypes, Component} from 'react'
import useSheet from 'react-jss'
import classNames from 'classnames'

class TextTruncate extends Component {
    render() {
        const {children, className, sheet: {classes}} = this.props

        const textTruncateClass = classNames(classes.base, className)

        return (
            <div name="text-truncate" className={textTruncateClass}>
                {children}
            </div>)
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
    className: PropTypes.string
}

export default useSheet(TextTruncate, style)
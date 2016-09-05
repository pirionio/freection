const React = require('react')
const {PropTypes, Component} = React
const useSheet = require('react-jss').default
const classNames = require('classnames')

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

module.exports = useSheet(TextTruncate, style)
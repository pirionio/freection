const React = require('react')
const {PropTypes, Component} = React
const radium = require('radium')

class TextTruncate extends Component {
    render() {
        const {style, children} = this.props

        const textTruncateStyle = {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        }

        return (
            <div style={[textTruncateStyle, style]}>
                {children}
            </div>)
    }
}
TextTruncate.propTypes = {
    style: PropTypes.object
}

module.exports = radium(TextTruncate)
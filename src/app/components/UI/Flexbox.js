const React = require('react')
const {PropTypes, Component} = React
const radium = require('radium')
const isString = require('lodash/isString')

class Flexbox extends Component {

    getContainerStyle() {
        const {container} = this.props
        if (container) {

            if (isString(container)) {
                return {
                    display: 'flex',
                    flexDirection: container
                }
            }
            else {
                return {
                    display: 'flex'
                }
            }
        }

        return {}
    }

    getWidthStyle() {
        const {width} = this.props

        if (width)
            return {width}

        return {}
    }

    getHeightStyle() {
        const {height} = this.props

        if (height)
            return {height}

        return {}
    }

    getFlexStyle() {
        const { grow, shrink, basis } = this.props

        return {
            flex: `${grow} ${shrink} ${basis}`
        }
    }

    getJustifyContent() {
        const {justifyContent} = this.props

        if (justifyContent) {
            return {justifyContent}
        }

        return {}
    }

    render() {
        const {children, style} = this.props

        const containerStyle = [
            this.getContainerStyle(),
            this.getFlexStyle(),
            this.getJustifyContent(),
            this.getWidthStyle(),
            this.getHeightStyle(),
            style
        ]

        return (<div style={containerStyle}>
            {children}
        </div>)
    }
}
Flexbox.propTypes = {
    style: PropTypes.object,
    container: PropTypes.any,
    width: PropTypes.string,
    height: PropTypes.string,
    grow: PropTypes.number,
    shrink: PropTypes.number,
    basis: PropTypes.string,
    justifyContent: PropTypes.string
}
Flexbox.defaultProps = {
    container: false,
    grow: 0,
    shrink: 1,
    basis: 'auto'
}

module.exports = radium(Flexbox)

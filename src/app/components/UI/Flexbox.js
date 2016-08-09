const React = require('react')
const {PropTypes, Component} = React
const radium = require('radium')
const classnames = require('classnames')
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
            } else {
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

    getAlignItems() {
        const {alignItems} = this.props

        if (alignItems) {
            return {alignItems}
        }

        return {}
    }

    getAlignSelf() {
        const {alignSelf} = this.props

        if (alignSelf) {
            return {alignSelf}
        }

        return {}
    }

    render() {
        const {children, style, name} = this.props

        const containerStyle = [
            this.getContainerStyle(),
            this.getFlexStyle(),
            this.getJustifyContent(),
            this.getAlignItems(),
            this.getAlignSelf(),
            this.getWidthStyle(),
            this.getHeightStyle(),
            style
        ]

        return (
            <div name={name} style={containerStyle}>
                {children}
            </div>
        )
    }
}

Flexbox.propTypes = {
    name: PropTypes.string,
    style: PropTypes.object,
    container: PropTypes.any,
    width: PropTypes.string,
    height: PropTypes.string,
    grow: PropTypes.number,
    shrink: PropTypes.number,
    basis: PropTypes.string,
    justifyContent: PropTypes.string,
    alignItems: PropTypes.string,
    alignSelf: PropTypes.string
}

Flexbox.defaultProps = {
    container: false,
    grow: 0,
    shrink: 1,
    basis: 'auto'
}

module.exports = radium(Flexbox)

const React = require('react')
const {PropTypes, Component} = React
const classNames = require('classnames')

const isString = require('lodash/isString')
const merge = require('lodash/merge')

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
        const {children, className, name, onClick, container} = this.props

        const style = merge({}, {
            display: container ? 'flex' : undefined,
            flexDirection: container ? container : undefined,
            flexGrow: this.props.grow,
            flexShrink: this.props.shrink,
            flexBasis: this.props.basis,
            justifyContent: this.props.justifyContent,
            alignItems: this.props.alignItems,
            alignSelf: this.props.alignSelf
        })

        return (
            <div name={name} style={style} className={className} onClick={onClick}>
                {children}
            </div>
        )
    }
}

Flexbox.propTypes = {
    name: PropTypes.string,
    className: PropTypes.string,
    container: PropTypes.any,
    grow: PropTypes.number,
    shrink: PropTypes.number,
    basis: PropTypes.string,
    justifyContent: PropTypes.string,
    alignItems: PropTypes.string,
    alignSelf: PropTypes.string,
    onClick: PropTypes.func
}

Flexbox.defaultProps = {
    container: false,
    grow: 0,
    shrink: 1,
    basis: 'auto'
}

module.exports = Flexbox

const React = require('react')
const {Component, PropTypes} = React
const radium = require('radium')

class Link extends Component {
    constructor(props, context) {
        super(props, context)

        this.onClick = this.onClick.bind(this)
    }

    onClick(event) {
        const {to} = this.props
        event.preventDefault()
        this.context.router.push(to)
    }

    render() {
        const {children, to, style, activeStyle} = this.props
        const {router} = this.context

        const href = router.createHref(to)
        const isActive = router.isActive(to, false)

        return (<a href={href} onClick={this.onClick} style={[style, isActive && activeStyle]}>{children}</a>)
    }
}

Link.propTypes = {
    to: PropTypes.string,
    style: PropTypes.object,
    activeStyle: PropTypes.object
}
Link.contextTypes = {
    router: PropTypes.object
}

module.exports = radium(Link)
import React, {Component, PropTypes} from 'react'
import classAutobind from 'class-autobind'
import classNames from 'classnames'

class Link extends Component {
    constructor(props, context) {
        super(props, context)
        classAutobind(this, Link.prototype)
    }

    onClick(event) {
        const {to, onClick} = this.props
        event.preventDefault()

        if (onClick)
            onClick(event)

        this.context.router.push(to)
    }

    render() {
        const {children, to, className, activeClassName} = this.props
        const {router} = this.context

        const href = router.createHref(to)
        const isActive = router.isActive(to, false)

        const classes = classNames(className, isActive && activeClassName)

        return (<a href={href} onClick={this.onClick} className={classes}>{children}</a>)
    }
}

Link.propTypes = {
    to: PropTypes.string,
    className: PropTypes.string,
    activeClassName: PropTypes.string,
    onClick: PropTypes.func
}

Link.contextTypes = {
    router: PropTypes.object
}

export default Link
import React, {PropTypes, Component} from 'react'
import merge from 'lodash/merge'
import omit from 'lodash/omit'

class Flexbox extends Component {
    focus() {
        if (this._div)
            this._div.focus()
    }

    render() {
        const {id, name, className, style, container, inline,
            grow, shrink, basis, justifyContent, alignItems, alignSelf,
            onClick, children} = this.props

        const rest = omit(this.props, [
            'id', 'name', 'className', 'style', 'container', 'inline',
            'grow', 'shrink', 'basis', 'justifyContent', 'alignItems', 'alignSelf',
            'onClick', 'children'
        ])

        const finalStyle = merge({}, {
            display: container ?  (inline ? 'inline-flex' : 'flex') : undefined,
            flexDirection: container ? container : undefined,
            flexGrow: grow,
            flexShrink: shrink,
            flexBasis: basis,
            justifyContent: justifyContent,
            alignItems: alignItems,
            alignSelf: alignSelf
        }, style)

        return (
            <div id={id} name={name} style={finalStyle} className={className} onClick={onClick} {...rest} ref={ref => this._div = ref}>
                {children}
            </div>
        )
    }
}

Flexbox.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    container: PropTypes.any,
    inline: PropTypes.bool,
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
    basis: 'auto',
    inline: false
}

export default Flexbox

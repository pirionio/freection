import React, {PropTypes, Component} from 'react'
import merge from 'lodash/merge'

class Flexbox extends Component {
    render() {
        const {children, className, style, id, name, onClick, container} = this.props

        const finalStyle = merge({}, {
            display: container ? 'flex' : undefined,
            flexDirection: container ? container : undefined,
            flexGrow: this.props.grow,
            flexShrink: this.props.shrink,
            flexBasis: this.props.basis,
            justifyContent: this.props.justifyContent,
            alignItems: this.props.alignItems,
            alignSelf: this.props.alignSelf
        }, style)

        return (
            <div id={id} name={name} style={finalStyle} className={className} onClick={onClick}>
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

export default Flexbox

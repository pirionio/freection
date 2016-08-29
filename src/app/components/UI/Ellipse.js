const React = require('react')
const {PropTypes} = React
const merge = require('lodash/merge')

const Ellipse = ({width, height, color, text, style}) => {
    const finalStyle = merge({},
        {
            display: 'inline-block',
            borderRadius: '50%',
            marginRight: '11px'
        },
        style,
        {
            width,
            height,
            backgroundColor: color
        }
    )

    return (
        <div style={finalStyle}>
            {text}
        </div>
    )
}

Ellipse.propTypes = {
    color: PropTypes.string.isRequired,
    width: PropTypes.string,
    height: PropTypes.string,
    text: PropTypes.any,
    style: PropTypes.object
}

module.exports = Ellipse

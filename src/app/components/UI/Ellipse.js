const React = require('react')
const {PropTypes} = React

const Ellipse = ({width, height, color, text, style}) => {
    const finalStyle = Object.assign({},
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
    width: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    text: PropTypes.any,
    style: PropTypes.object
}

module.exports = Ellipse

const React = require('react')
const {PropTypes} = React

const Ellipse = ({width,height,color}) => {
    return <div style={{
        display: 'inline-block',
        width,
        height,
        backgroundColor: color,
        borderRadius: '50%',
        marginRight: '11px'
    }} />
}

Ellipse.propTypes = {
    width: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired
}

module.exports = Ellipse

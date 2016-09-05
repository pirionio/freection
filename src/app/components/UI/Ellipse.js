const React = require('react')
const {PropTypes} = React
const useSheet = require('react-jss').default
const classNames = require('classnames')

const Ellipse = ({color, text, className, oval, sheet: {classes}}) => {
    const ellipseClass = classNames(className ? className : classes.base, oval ? classes.oval : classes.circle)

    return (
        <div className={ellipseClass} style={{backgroundColor: color}}>
            {text}
        </div>
    )
}

Ellipse.propTypes = {
    color: PropTypes.string.isRequired,
    text: PropTypes.any,
    className: PropTypes.string,
    oval: PropTypes.bool
}

const style = {
    circle: {
        borderRadius: '50%'
    },
    oval: {
        borderBottomLeftRadius: '100%30px',
        borderBottomRightRadius: '100%30px',
        borderTopLeftRadius: '100%30px',
        borderTopRightRadius: '100%30px'
    },
    base: {
        display: 'inline-block'
    }
}

module.exports = useSheet(Ellipse, style)

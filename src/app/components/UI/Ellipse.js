import React, {PropTypes} from 'react'
import useSheet from 'react-jss'
import classNames from 'classnames'

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

export default useSheet(Ellipse, style)

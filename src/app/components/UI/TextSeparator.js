import React from 'react'
import useSheet from 'react-jss'

const TextSeparator = ({sheet: {classes}}) => {
    return <div className={classes.separator}>•</div>
}

const style = {
    separator: {
        width: 13,
        textAlign: 'center'
    }}

export default useSheet(TextSeparator, style)
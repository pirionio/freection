const React = require('react')
const useSheet = require('react-jss').default

const TextSeparator = ({sheet: {classes}}) => {
    return <div className={classes.separator}>•</div>
}

const style = {
    separator: {
        width: 13,
        textAlign: 'center'
}}

module.exports = useSheet(TextSeparator, style)
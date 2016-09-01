const React = require('react')

const TextSeparator = () => {
    const style = {
        separator: {
            width: '13px',
            textAlign: 'center'
    }}

    return <div style={style.separator}>•</div>
}

module.exports = TextSeparator
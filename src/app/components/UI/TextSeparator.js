const React = require('react')

const TextSeparator = () => {
    const style = {
        separator: {
            width: '13px',
            textAlign: 'center'
    }}

    return <div shrink={0} style={style.separator}>•</div>
}

module.exports = TextSeparator
const React = require('react')
const {PropTypes} = React
const TextTruncate = require('../../UI/TextTruncate')

const BodyPreviewText = ({body}) => {
    return (
        <TextTruncate>{body}</TextTruncate>
    )
}

BodyPreviewText.propTypes = {
    body: PropTypes.string.isRequired
}

module.exports = BodyPreviewText

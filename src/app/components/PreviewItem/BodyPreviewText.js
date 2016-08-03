const React = require('react')
const {PropTypes} = React

const BodyPreviewText = ({body}) => {
    return (
        <div className="preview-comment-text">
            {body}
        </div>
    )
}

BodyPreviewText.propTypes = {
    body: PropTypes.string.isRequired
}

module.exports = BodyPreviewText

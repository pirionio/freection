const React = require('react')
const {PropTypes} = React
const TextTruncate = require('../../UI/TextTruncate')

const CommentPreviewText = ({comment, numOfNewComments}) => {
    const unreadCount = numOfNewComments > 1 ?
        <div className="preview-comment-unread-count">
            (+{numOfNewComments - 1})
        </div> : null

     const textTruncateStyle = {
        display: 'inline-block',
        width:'100%'
     }

    return (
        <div>
            <TextTruncate style={textTruncateStyle}>{comment}</TextTruncate>
            {unreadCount}
        </div>
    )
}

CommentPreviewText.propTypes = {
    comment: PropTypes.string.isRequired,
    numOfNewComments: PropTypes.number
}
CommentPreviewText.defaultProps = {
    numOfNewComments: 0
}

module.exports = CommentPreviewText
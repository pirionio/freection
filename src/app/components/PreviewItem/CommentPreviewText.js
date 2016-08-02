const React = require('react')
const {PropTypes} = React

const CommentPreviewText = ({comment, numOfNewComments}) => {
    const unreadCount = numOfNewComments > 1 ?
        <div className="preview-comment-unread-count">
            (+{numOfNewComments - 1})
        </div> : ''

    return (
        <span>
            <div className="preview-comment-text">
                {comment}
            </div>
            {unreadCount}
        </span>
    )
}

CommentPreviewText.propTypes = {
    comment: PropTypes.string.isRequired,
    numOfNewComments: PropTypes.number.isRequired
}

module.exports = CommentPreviewText
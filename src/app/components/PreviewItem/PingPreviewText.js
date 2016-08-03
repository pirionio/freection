const React = require('react')
const {PropTypes} = React

const PingPreviewText = ({numOfNewComments}) => {
    const unreadCount = numOfNewComments > 1 ?
        <div className="preview-comment-unread-count">
            (+{numOfNewComments - 1})
        </div> : ''

    return (
        <span>
            <div className="preview-comment-text">
               Ping!!
            </div>
            {unreadCount}
        </span>
    )
}

PingPreviewText.propTypes = {
    numOfNewComments: PropTypes.number
}
PingPreviewText.defaultProps = {
    numOfNewComments: 0
}

module.exports = PingPreviewText
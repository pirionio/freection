const React = require('react')
const {PropTypes} = React

const PingPreviewText = ({newNotifications}) => {
    const unreadCount = newNotifications.length > 1 ?
        <div className="preview-comment-unread-count">
            (+{newNotifications.length - 1})
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
    newNotifications: PropTypes.array
}
PingPreviewText.defaultProps = {
    newNotifications: []
}

module.exports = PingPreviewText
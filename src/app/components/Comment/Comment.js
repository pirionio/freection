const React = require('react')
const {Component, PropTypes} = React
const dateFns = require('date-fns')
const VisibilitySensor = require('react-visibility-sensor')
const {connect} = require('react-redux')
const classnames = require('classnames')

const MarkCommentReadActions = require('../../actions/mark-comment-read-actions')
const EventTypes = require('../../../common/enums/event-types')

class Comment extends Component {
    constructor(props) {
        super(props)
        this.onVisibilityChange = this.onVisibilityChange.bind(this)
    }

    onVisibilityChange(isVisible) {
        const {comment} = this.props

        if (!comment.payload.isRead && isVisible) {
            this.markAsRead()
        }
    }

    markAsRead() {
        const {comment, currentUser} = this.props

        this.props.markAsRead(comment, currentUser)
    }

    getCommentText() {
        const {comment} = this.props
        return comment.eventType.key === EventTypes.PING.key ? 'Ping!' : comment.payload.text
    }

    render() {
        const {comment} = this.props
        const createdAt = dateFns.format(comment.createdAt, 'DD-MM-YYYY HH:mm')
        const containerClassname = classnames('comment-container', {
            'comment-unread': !comment.payload.isRead,
            'comment-read': comment.payload.isRead
        })

        return (
        <VisibilitySensor onChange={this.onVisibilityChange} >
            <div className={containerClassname}>
                <div className="comment-creator">
                    {comment.creator.email} :
                </div>
                <div className="comment-message">
                    {this.getCommentText()}
                </div>
                <div className="comment-date">
                    {createdAt}
                </div>
            </div>
        </VisibilitySensor>
        )
    }
}

Comment.propTypes = {
    comment: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.auth
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        markAsRead: (comment,user) => dispatch(MarkCommentReadActions.markCommentAsRead(comment, user))
    }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Comment)
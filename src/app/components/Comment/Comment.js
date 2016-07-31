const React = require('react')
const {Component, PropTypes} = React
const dateFns = require('date-fns')
const VisibilitySensor = require('react-visibility-sensor')
const {connect} = require('react-redux')
const classnames = require('classnames')

const EventTypes = require('../../../common/enums/event-types')
const ThingCommandActions = require('../../actions/thing-command-actions')

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

        this.props.dispatch(ThingCommandActions.markCommentAsRead(comment, currentUser))
    }

    getCommentText() {
        const {comment} = this.props
        return comment.eventType && comment.eventType.key === EventTypes.PING.key ? 'Ping!' : comment.payload.text
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

module.exports = connect(mapStateToProps)(Comment)
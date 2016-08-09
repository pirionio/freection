const React = require('react')
const {Component, PropTypes} = React
const {chain, sortBy} = require('lodash/core')

const Comment = require('./Comment')
const Scrollable = require('../Scrollable/Scrollable')

class CommentList extends Component {
    componentDidMount() {
        const {comments} = this.props

        const firstUnreadMessage = chain(comments)
            .sortBy('createdAt')
            .filter({isRead: false})
            .head()
            .value()

        if (firstUnreadMessage) {
            this._scrollable.scrollTo(firstUnreadMessage.id)
        } else {
            this._scrollable.scrollToBottom()
        }
    }

    render() {
        const comments = sortBy(this.props.comments, 'createdAt').map(comment => (<Comment key={comment.id} comment={comment} />))

        return (
            <Scrollable stickToBottom={true} ref={scrollable => this._scrollable = scrollable}>
                {comments}
            </Scrollable>
        )
    }
}

CommentList.propTypes = {
    comments: PropTypes.array.isRequired
}

module.exports = CommentList
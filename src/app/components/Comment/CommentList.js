const React = require('react')
const {Component, PropTypes} = React
const {chain, sortBy} = require('lodash/core')

const Comment = require('./Comment')
const Scrollable = require('../Scrollable/Scrollable')

class CommentList extends Component {
    componentDidMount() {
        const {comments} = this.props

        const firstUnreadMessage = chain(comments)
            .sortBy(comment => comment.createdAt)
            .filter(comment => !comment.payload.isRead).head().value()

        if (firstUnreadMessage) {
            this._scrollable.scrollTo(firstUnreadMessage.id)
        } else {
            this._scrollable.scrollToBottom()
        }
    }

    render() {
        const {comments} = this.props

        return (<Scrollable ref={scrollable => this._scrollable = scrollable}>
            {
                sortBy(comments, comment => comment.createdAt)
                    .map(comment => (<Comment key={comment.id} comment={comment} />))
            }
        </Scrollable>)
    }
}

CommentList.propTypes = {
    comments: PropTypes.array.isRequired
}

module.exports = CommentList
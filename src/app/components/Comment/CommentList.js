const React = require('react')
const {Component, PropTypes} = React
const {chain, sortBy} = require('lodash/core')

const Comment = require('./Comment')
const Scrollable = require('../Scrollable/Scrollable')
const Flexbox = require('../UI/Flexbox')
const styleVars = require('../style-vars')

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
        const {comments} = this.props

        const styles = {
            unreadTitle: {
                height: '25px',
                color: styleVars.highlightColor
            }
        }

        const readComments = chain(comments)
            .sortBy('createdAt')
            .filter(comment => comment.payload.initialIsRead)
            .map(comment => <Comment key={comment.id} comment={comment} />)
            .value()

        const unreadComments = chain(comments)
            .sortBy('createdAt')
            .filter(comment => !comment.payload.initialIsRead)
            .map(comment => <Comment key={comment.id} comment={comment} />)
            .value()

        if (!unreadComments || !unreadComments.length) {
            return (
                <Scrollable stickToBottom={true} ref={scrollable => this._scrollable = scrollable}>
                    {readComments}
                </Scrollable>
            )
        }

        return (
            <Scrollable stickToBottom={true} ref={scrollable => this._scrollable = scrollable}>
                {readComments}
                <Flexbox container="row" justifyContent="center" alignItems="center" style={styles.unreadTitle}>
                    Unread Messages
                </Flexbox>
                {unreadComments}
            </Scrollable>
        )
    }
}

CommentList.propTypes = {
    comments: PropTypes.array.isRequired
}

module.exports = CommentList
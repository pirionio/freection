const React = require('react')
const {Component, PropTypes} = React
const classAutobind = require('class-autobind').default
const useSheet = require('react-jss').default

const {chain} = require('lodash/core')

const Comment = require('./Comment')
const Scrollable = require('../Scrollable/Scrollable')
const Flexbox = require('../UI/Flexbox')
const styleVars = require('../style-vars')

class CommentList extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, CommentList.prototype)
    }

    componentDidMount() {
        const {comments} = this.props

        const firstUnreadMessage = chain(comments)
            .sortBy('createdAt')
            .filter({isRead: false})
            .head()
            .value()

        if (firstUnreadMessage && this._scrollable) {
            this._scrollable.scrollTo(firstUnreadMessage.id)
        } else {
            this._scrollable.scrollToBottom()
        }
    }

    render() {
        const {comments, sheet: {classes}} = this.props

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
                <Flexbox container="row" justifyContent="center" alignItems="center" className={classes.title}>
                    Unread Messages
                </Flexbox>
                {unreadComments}
            </Scrollable>
        )
    }
}

const style = {
    title: {
        height: 25,
        color: styleVars.highlightColor
    }
}

CommentList.propTypes = {
    comments: PropTypes.array.isRequired
}

module.exports = useSheet(CommentList, style)
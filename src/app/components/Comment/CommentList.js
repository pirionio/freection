import React, {Component, PropTypes} from 'react'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'

import {chain} from 'lodash/core'

import Comment from './Comment'
import Scrollable from '../Scrollable/Scrollable'
import Flexbox from '../UI/Flexbox'
import styleVars from '../style-vars'

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

export default useSheet(CommentList, style)
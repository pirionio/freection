import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'
import VisibilitySensor from 'react-visibility-sensor'
import {chain} from 'lodash/core'
import last from 'lodash/last'

import Comment from './Comment'
import Scrollable from '../Scrollable/Scrollable'
import Flexbox from '../UI/Flexbox'
import styleVars from '../style-vars'
import Down from '../../static/unread-comments-arrow.svg'

class CommentList extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, CommentList.prototype)

        this.state = {
            isUnreadTitleVisible: false,
            showUnreadNotification: false
        }
    }

    componentWillReceiveProps() {
        this.setState({
            showUnreadNotification: this.commentsList ? !this.commentsList.isAtBottom() : false
        })
    }

    getScrollToElementId() {
        const {comments} = this.props

        const unreadComments = this.getCurrentlyUnreadComments()

        if (unreadComments && unreadComments.length) {
            return 'unread-title'
        }

        const lastComment = last(comments)
        return lastComment && lastComment.id
    }

    getUnreadMessagesTitle(unreadComments) {
        const {sheet: {classes}} = this.props

        return unreadComments && unreadComments.length ?
            <Flexbox container="row" justifyContent="center" alignItems="center" className={classes.unreadMessageTitle} key="unread-title">
                <VisibilitySensor onChange={this.unreadTitleVisibilityChanged}>
                    <span>Unread Messages</span>
                </VisibilitySensor>
            </Flexbox> :
            null
    }

    getUnreadMessagesNotification() {
        const {sheet: {classes}} = this.props

        const currentlyUnreadComments = this.getCurrentlyUnreadComments()

        return !this.state.isUnreadTitleVisible && currentlyUnreadComments.length && this.state.showUnreadNotification ?
            <Flexbox name="unread-notification-container" container="row" justifyContent="center" className={classes.unreadNotificationContainer}>
                <Flexbox name="unread-notification" className={classes.unreadNotification} onClick={this.goToUnreadMessages}>
                    <img src={Down} className={classes.arrowDown} />
                    <span>{currentlyUnreadComments.length} new messages</span>
                </Flexbox>
            </Flexbox> :
            null
    }

    goToUnreadMessages() {
        this.commentsList.scrollTo(this.getScrollToElementId())
    }

    unreadTitleVisibilityChanged(isVisible) {
        if (isVisible !== this.state.isUnreadTitleVisible) {
            this.setState({
                isUnreadTitleVisible: isVisible
            })
        }
    }

    getReadComments() {
        const {comments} = this.props
        return chain(comments)
            .sortBy('createdAt')
            .filter(comment => comment.payload.initialIsRead)
            .map(comment => <Comment key={comment.id} comment={comment} />)
            .value()
    }

    getInitiallyUnreadComments() {
        const {comments} = this.props
        return chain(comments)
            .sortBy('createdAt')
            .filter(comment => !comment.payload.initialIsRead)
            .map(comment => <Comment key={comment.id} comment={comment} />)
            .value()
    }

    getCurrentlyUnreadComments() {
        const {comments} = this.props
        return chain(comments)
            .sortBy('createdAt')
            .filter(comment => !comment.payload.isRead)
            .map(comment => <Comment key={comment.id} comment={comment} />)
            .value()
    }

    render() {
        const {sheet: {classes}} = this.props

        const readComments = this.getReadComments()
        const unreadComments = this.getInitiallyUnreadComments()
        const unreadMessagesTitle = this.getUnreadMessagesTitle(unreadComments)

        return (
            <Flexbox name="comments-list" grow={1} container="column" className={classes.container}>
                <Scrollable stickToBottom={true} getScrollToElementId={this.getScrollToElementId} scrollableRef={ref => this.commentsList = ref}>
                    {readComments}
                    {unreadMessagesTitle}
                    {unreadComments}
                </Scrollable>
                {this.getUnreadMessagesNotification(unreadComments)}
            </Flexbox>
        )
    }
}

const style = {
    container: {
        position: 'relative'
    },
    unreadMessageTitle: {
        height: 32,
        marginBottom: 5,
        color: styleVars.highlightColor,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        fontWeight: 500
    },
    unreadNotificationContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%'
    },
    unreadNotification: {
        padding: [9, 20],
        color: 'white',
        backgroundColor: styleVars.primaryColor,
        textTransform: 'uppercase',
        letterSpacing: '0.025em',
        fontSize: '0.857em',
        fontWeight: 500,
        borderRadius: 18,
        cursor: 'pointer'
        },
    arrowDown: {
        height: 10,
        width: 8,
        marginRight: 10,
        paddingTop: 3
    }
}

CommentList.propTypes = {
    comments: PropTypes.array.isRequired
}

// It's important to connect to redux here, in order to make sure that the child component of Scrollable is re-rendered when there is a change
// in state, this way resizing itself accordingly.
export default useSheet(connect()(CommentList), style)
import React, {Component, PropTypes} from 'react'
import dateFns from 'date-fns'
import VisibilitySensor from 'react-visibility-sensor'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import classNames from 'classnames'
import useSheet from 'react-jss'

import * as HtmlUtil from '../../util/html-util'
import EventTypes from '../../../common/enums/event-types'
import * as ThingCommandActions from '../../actions/thing-command-actions'
import Flexbox from '../UI/Flexbox'
import TextTruncate from '../UI/TextTruncate'
import styleVars from '../style-vars'
import textToHtml from '../../../common/util/textToHtml'
import {GeneralConstants} from '../../constants'

class Comment extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, Comment.prototype)
    }

    onVisibilityChange(isVisible) {
        const {comment} = this.props

        if (!comment.payload.isRead && isVisible) {
            this.markAsRead()
        }
    }

    markAsRead() {
        const {comment} = this.props
        this.props.dispatch(ThingCommandActions.markCommentAsRead(comment))
    }

    getCommentText() {
        const {comment} = this.props

        if (comment.eventType && comment.eventType.key === EventTypes.PING.key)
            return 'Ping!'

        const html = comment.payload.html ? comment.payload.html : textToHtml(comment.payload.text)

        return this.parseEmailHtml(html)
    }

    parseEmailHtml(html) {
        const parsedHtml = HtmlUtil.parse(html)
        return <div dangerouslySetInnerHTML={{__html: parsedHtml}}></div>
    }

    render() {
        const {comment, sheet: {classes}} = this.props
        const createdAt = dateFns.format(comment.createdAt, 'DD-MM-YYYY HH:mm')

        const unread = !comment.payload.initialIsRead ?
            <Flexbox name="comment-unread" className={classes.unread}>
                <span>*</span>
            </Flexbox> :
            null

        const textClass = classNames(classes.text, GeneralConstants.INSPECTLET_SENSITIVE_CLASS)

        return (
            <VisibilitySensor onChange={this.onVisibilityChange} partialVisibility={true}>
                <Flexbox name="comment-container" container="column" alignItems="flex-start" className={classes.comment}>
                    <Flexbox name="comment-header" container="row" justifyContent="flex-end" alignItems="center" className={classes.header}>
                        <Flexbox name="comment-creator" grow={1} shrink={0} container="row" alignItems="center" className={classes.creator}>
                            <TextTruncate>{comment.creator.displayName}</TextTruncate>
                            {unread}
                        </Flexbox>
                        <Flexbox name="comment-date" shrink={0} className={classes.date}>
                            {createdAt}
                        </Flexbox>
                    </Flexbox>
                    <Flexbox name="comment-message" grow={1} className={textClass}>
                        {this.getCommentText()}
                    </Flexbox>
                </Flexbox>
            </VisibilitySensor>
        )
    }
}

const style = {
    comment: {
        minHeight: 79,
        padding: [24, 30],
        marginBottom: 5,
        backgroundColor: 'white',
        border: `1px solid ${styleVars.baseBorderColor}`
    },
    unread: {
        color: styleVars.highlightColor,
        letterSpacing: '0.1em',
        marginLeft: 5
    },
    header: {
        width: '100%',
        marginBottom: 20
    },
    creator: {
        fontWeight: 'bold'
    },
    date: {
        color: styleVars.baseGrayColor
    },
    text: {
        lineHeight: '2',
        letterSpacing: styleVars.messageLetterSpacing
    }
}

Comment.propTypes = {
    comment: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired
}

const mapStateToProps = state => {
    return {
        currentUser: state.auth
    }
}

export default useSheet(connect(mapStateToProps)(Comment), style)
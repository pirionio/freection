import React, {Component, PropTypes} from 'react'
import dateFns from 'date-fns'
import VisibilitySensor from 'react-visibility-sensor'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import classNames from 'classnames'
import useSheet from 'react-jss'
import Icon from 'react-fontawesome'
import find from 'lodash/find'
import uniq from 'lodash/uniq'

import * as HtmlUtil from '../../util/html-util'
import EventTypes from '../../../common/enums/event-types'
import * as ThingCommandActions from '../../actions/thing-command-actions'
import Flexbox from '../UI/Flexbox'
import TextTruncate from '../UI/TextTruncate'
import styleVars from '../style-vars'
import textToHtml from '../../../common/util/textToHtml'
import {GeneralConstants} from '../../constants'
import Tooltip from '../UI/Tooltip.js'

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
        return <div dir="auto" dangerouslySetInnerHTML={{__html: parsedHtml}}></div>
    }

    getReadBy() {
        const {comment, currentUser, users, sheet: {classes}} = this.props

        const tooltipId = `readByTooltip-${comment.id}`

        const readByList = uniq(comment.payload.readByList)
            .map(userId => find(users, user => user.id === userId))
            .filter(user => !!user)
            .map(user => currentUser.id === user.id ? 'You' : user.displayName)

        const list =  comment.payload.readByEmailList ? [...readByList, ...comment.payload.readByEmailList] : readByList

        if (list.length === 0)
            return <Icon name="eye-slash" className={classes.notReadBy} />

        return (<div data-tip data-for={tooltipId}>
            <Icon name="eye" className={classes.readBy} />
            <Tooltip id={tooltipId} type="light" className={classes.readByTooltip} place="right">
                <div className={classes.readByTooltipTitle}>Seen By:</div>
                <div>
                    {list.map((name,index) => {
                        return (
                            <div className={classes.readByTooltipItem} key={index} >
                                {name}
                            </div>
                        )
                    })}
                </div>
            </Tooltip>
        </div>)
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

        const readBy = this.getReadBy()

        return (
            <VisibilitySensor onChange={this.onVisibilityChange} partialVisibility={true}>
                <Flexbox name="comment-container" container="column" className={classes.comment}>
                    <Flexbox name="comment-header" container="row" justifyContent="flex-end" className={classes.header}>
                        <Flexbox name="comment-header-left" container="column" grow={1}>
                            <Flexbox name="comment-creator" grow={1} shrink={0} container="row" alignItems="center" className={classes.creator}>
                                <TextTruncate>{comment.creator.displayName}</TextTruncate>
                                {unread}
                            </Flexbox>
                            <Flexbox name="comment-date" shrink={0} className={classes.date}>
                                {createdAt}
                            </Flexbox>
                        </Flexbox>
                        <Flexbox>
                            { readBy }
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
        marginBottom: 28
    },
    creator: {
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: '0.857em',
        marginBottom: 8
    },
    date: {
        color: styleVars.baseGrayColor,
        fontSize: '0.857em'
    },
    readBy: {
        fontSize: '0.857em',
        cursor: 'pointer'
    },
    readByTooltip: {
        display: 'block',
        maxWidth: 500,
        whiteSpace: 'pre-line',
        color: 'black !important',
        boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.15)',
        fontSize: '0.714em'
    },
    readByTooltipTitle: {
        color: styleVars.baseGrayColor,
        marginBottom: 10
    },
    readByTooltipItem: {
        color: 'rgb(30, 39, 44)',
        lineHeight: 1.8
    },
    notReadBy: {
        fontSize: '0.857em',
        color: styleVars.baseGrayColor
    },
    text: {
        lineHeight: '2',
        letterSpacing: styleVars.messageLetterSpacing
    }
}

Comment.propTypes = {
    comment: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    users: PropTypes.array.isRequired
}

const mapStateToProps = state => {
    return {
        currentUser: state.auth,
        users: state.users
    }
}

export default useSheet(connect(mapStateToProps)(Comment), style)
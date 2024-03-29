import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import useSheet from 'react-jss'

import SharedConstants from '../../../common/shared-constants'
import EventTypes from '../../../common/enums/event-types'
import * as ThingPageActions from '../../actions/thing-page-actions'
import PreviewItem, { PreviewItemStatus, PreviewItemText, PreviewItemActions} from '../Preview/PreviewItem'
import {CommentPreviewText, PingPreviewText} from '../Preview/Thing'
import TextSeparator from '../UI/TextSeparator'
import Flexbox from '../UI/Flexbox'
import styleVars from '../style-vars'
import CommandsBar from '../Commands/CommandsBar.js'

class NotificationPreviewItem extends Component {

    getTextElement() {
        const {notification, sheet: {classes}} = this.props

        if (!notification.payload.text && notification.eventType.key !== EventTypes.PING.key)
            return null

        let text = null

        if (notification.eventType.key === EventTypes.PING.key)
            text = <PingPreviewText />

        else if (SharedConstants.MESSAGE_TYPED_EVENTS.includes(notification.eventType.key))
            text = <CommentPreviewText comment={notification.payload.text}
                                       newNotifications={notification.payload.newNotifications} />

        else if (notification.eventType.key === EventTypes.SUGGESTION.key)
            text = <CommentPreviewText comment={notification.payload.text}
                                       newNotifications={notification.payload.newNotifications} />

        if (text) {
            return (
                <Flexbox container="row">
                    <Flexbox shrink={0}><TextSeparator /></Flexbox>
                    <Flexbox grow={1} className={classes.textRow}>{text}</Flexbox>
                </Flexbox>)
        }

        return null
    }

    getExpandedMessages() {
        const {notification} = this.props
        return notification.eventType.key !== EventTypes.PING.key ? [notification] : null
    }

    getStatusText() {
        const {notification} = this.props
        const {creator} = notification

        switch (notification.eventType.key) {
            case EventTypes.COMMENT.key:
                return  notification.payload.isMentioned ?
                    <span><strong>{creator.displayName}</strong> mentioned you</span> :
                    <span><strong>{creator.displayName}</strong> commented</span>
            case EventTypes.PING.key:
                return <span><strong>{creator.displayName}</strong> pinged you</span>
            case EventTypes.PONG.key:
                return <span><strong>{creator.displayName}</strong> ponged {notification.thing.isFollowUper ? 'you' : ''}</span>
            case EventTypes.CREATED.key:
                return notification.payload.isMentioned ?
                    <span><strong>{creator.displayName}</strong> mentioned you</span> :
                    <span><strong>{creator.displayName}</strong> sent you a task</span>
            case EventTypes.DONE.key:
                return <span><strong>{creator.displayName}</strong> completed a task</span>
            case EventTypes.DISMISSED.key:
                return <span><strong>{creator.displayName}</strong> dismissed a task</span>
            case EventTypes.SENT_BACK.key:
                return notification.thing.isMentioned ?
                    <span>Task sent back to <strong>{notification.thing.to.displayName}</strong> </span> :
                    <span><strong>{creator.displayName}</strong> sent a task back</span>
            case EventTypes.CLOSED.key:
                return <span><strong>{creator.displayName}</strong> closed a task</span>
            case EventTypes.SUGGESTION.key:
                return <span><strong>Freection Bot</strong> suggests</span>
            default:
                return <span><strong>{creator.displayName}</strong> {notification.eventType.label}</span>
        }
    }

    getCircleColor() {
        const {notification} = this.props

        switch (notification.eventType.key) {
            case EventTypes.COMMENT.key:
            case EventTypes.PING.key:
            case EventTypes.PONG.key:
                return styleVars.yellowCircleColor
            case EventTypes.CREATED.key:
            case EventTypes.SENT_BACK.key:
                return notification.payload && notification.payload.isMentioned ?
                    styleVars.yellowCircleColor :
                    styleVars.blueCircleColor
            case EventTypes.CLOSED.key:
            case EventTypes.DISMISSED.key:
                return styleVars.redCircleColor
            case EventTypes.DONE.key:
                return styleVars.greenCircleColor
            case EventTypes.SUGGESTION.key:
                return styleVars.basePurpleColor
            default:
                return 'black'
        }
    }

    render() {
        const {notification, dispatch} = this.props
        const textPreview = this.getTextElement()

        return (
            <PreviewItem circleColor={this.getCircleColor()}
                             title={notification.thing.subject}
                             date={notification.createdAt}
                             expandedMessages={this.getExpandedMessages()}
                             onClick={() => dispatch(ThingPageActions.show(notification.thing))}>
                <PreviewItemStatus>
                    {this.getStatusText()}
                </PreviewItemStatus>
                {textPreview ? <PreviewItemText>{textPreview}</PreviewItemText> : null}
                <PreviewItemActions>
                    <CommandsBar commands={notification.commands} thing={notification.thing} notification={notification} />
                </PreviewItemActions>
            </PreviewItem>
        )
    }
}

const style = {
    textRow: {
        minWidth: 0
    }
}

NotificationPreviewItem.propTypes = {
    notification: PropTypes.object.isRequired
}

export default useSheet(connect()(NotificationPreviewItem), style)

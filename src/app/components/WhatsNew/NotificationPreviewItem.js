const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')

const {SharedConstants} = require('../../../common/shared-constants')
const EventTypes = require('../../../common/enums/event-types')
const ThingPageActions = require('../../actions/thing-page-actions')

const {PreviewItem, PreviewItemText, PreviewItemStatus, PreviewItemActions} = require('../Preview/PreviewItem')
const {CommentPreviewText, PingPreviewText} = require('../Preview/Thing')
const NotificationActionsBar = require('./NotificationActionsBar')
const styleVars = require('../style-vars')

class NotificationPreviewItem extends Component {

    getTextElement() {
        const {notification} = this.props

        if (notification.eventType.key === EventTypes.PING.key)
            return <PingPreviewText />

        else if (SharedConstants.MESSAGE_TYPED_EVENTS.includes(notification.eventType.key))
            return <CommentPreviewText comment={notification.payload.text}
                                       newNotifications={notification.payload.newNotifications} />
        return <span />
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
                return <span><strong>{creator.displayName}</strong> commented</span>
            case EventTypes.PING.key:
                return <span><strong>{creator.displayName}</strong> pinged you</span>
            case EventTypes.PONG.key:
                return <span><strong>{creator.displayName}</strong> ponged you</span>
            case EventTypes.CREATED.key:
                return <span><strong>{creator.displayName}</strong> sent you a thing</span>
            case EventTypes.DONE.key:
                return <span><strong>{creator.displayName}</strong> completed a thing</span>
            case EventTypes.DISMISSED.key:
                return <span><strong>{creator.displayName}</strong> dismissed a thing</span>
            case EventTypes.SENT_BACK.key:
                return <span><strong>{creator.displayName}</strong> sent a thing back</span>
            case EventTypes.CLOSED.key:
                return <span><strong>{creator.displayName}</strong> closed a thing</span>
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
                return styleVars.blueCircleColor
            case EventTypes.CLOSED.key:
            case EventTypes.DISMISSED.key:
                return styleVars.redCircleColor
            case EventTypes.DONE.key:
                return styleVars.greenCircleColor
            default:
                return 'black'
        }
    }

    render() {
        const {notification, dispatch} = this.props
        const textPreview = this.getTextElement()

        return (<PreviewItem circleColor={this.getCircleColor()}
                             title={notification.thing.subject}
                             date={notification.createdAt}
                             expandedMessages={this.getExpandedMessages()}
                             onClick={() => dispatch(ThingPageActions.showThingPage(notification.thing))}>
            <PreviewItemStatus>
                {this.getStatusText()}
            </PreviewItemStatus>
            {textPreview ? <PreviewItemText>{textPreview}</PreviewItemText> : null}
            <PreviewItemActions>
                <NotificationActionsBar notification={notification} />
            </PreviewItemActions>
        </PreviewItem>)
    }
}

NotificationPreviewItem.propTypes = {
    notification: PropTypes.object.isRequired
}

module.exports = connect()(NotificationPreviewItem)

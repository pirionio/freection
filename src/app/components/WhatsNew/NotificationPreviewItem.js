const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')

const EventTypes = require('../../../common/enums/event-types')
const {PreviewItem, PreviewItemUser, PreviewItemTitle, PreviewItemDate, PreviewItemText, PreviewItemStatus, PreviewItemActions} =
    require('../Preview/PreviewItem')
const {CommentPreviewText, PingPreviewText, BodyPreviewText} = require('../Preview/Thing')
const NotificationActionsBar = require('./NotificationActionsBar')
const ThingPageActions = require('../../actions/thing-page-actions')
const styleVars = require('../style-vars')

class NotificationPreviewItem extends Component {

    getTextElement() {
        const {notification} = this.props

        switch (notification.eventType.key) {
            case EventTypes.COMMENT.key:
                return <CommentPreviewText comment={notification.payload.text}
                                           numOfNewComments={notification.payload.numOfNewComments} />
            case EventTypes.PING.key:
                return <PingPreviewText />

            case EventTypes.CREATED.key:
                return <BodyPreviewText body={notification.thing.body} />

            default:
                return <span></span>;
        }
    }

    getStatusText() {
        const {notification} = this.props
        const {creator} = notification

        switch (notification.eventType.key) {
            case EventTypes.COMMENT.key:
                return <span><strong>{creator.displayName}</strong> commented</span>
            case EventTypes.PING.key:
                return <span><strong>{creator.displayName}</strong> pinged you</span>
            case EventTypes.CREATED.key:
                return <span><strong>{creator.displayName}</strong> sent you a thing</span>
            case EventTypes.DONE.key:
                return <span><strong>{creator.displayName}</strong> completed a thing</span>
            case EventTypes.DISMISSED.key:
                return <span><strong>{creator.displayName}</strong> dismissed a thing</span>
            case EventTypes.SENT_BACK.key:
                return <span><strong>{creator.displayName}</strong> sent a thing back</span>
            case EventTypes.CLOSED.key:
            case EventTypes.CANCELED.key:
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
                return styleVars.yellowCircleColor
            case EventTypes.CREATED.key:
            case EventTypes.SENT_BACK.key:
                return styleVars.blueCircleColor
            case EventTypes.CANCELED.key:
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

        return (<PreviewItem circleColor={this.getCircleColor()}>
            <PreviewItemUser>
                <span>{notification.creator.displayName}</span>
            </PreviewItemUser>
            <PreviewItemStatus>
                {this.getStatusText()}
            </PreviewItemStatus>
            <PreviewItemTitle title={notification.thing.subject}
                              onClick={() => dispatch(ThingPageActions.show(notification.thing))} />
            <PreviewItemDate date={notification.createdAt}/>
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

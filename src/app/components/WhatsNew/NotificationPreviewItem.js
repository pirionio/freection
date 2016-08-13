const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')

const EventTypes = require('../../../common/enums/event-types')
const {PreviewItem, PreviewItemUser, PreviewItemTitle, PreviewItemDate, PreviewItemText, PreviewItemStatus, PreviewItemActions} =
    require('../Preview/PreviewItem')
const {CommentPreviewText, PingPreviewText, BodyPreviewText} = require('../Preview/Thing')
const NotificationActionsBar = require('./NotificationActionsBar')
const ThingPageActions = require('../../actions/thing-page-actions')

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
                return null;
        }
    }

    getStatusText() {
        const {notification} = this.props
        const {creator} = notification

        switch (notification.eventType.key) {
            case EventTypes.COMMENT.key:
                return <span><strong>{`${creator.displayName}`}</strong> commented</span>
            case EventTypes.CREATED.key:
                return <span><strong>{`${creator.displayName}`}</strong> sent you a thing</span>
            case EventTypes.DONE.key:
                return <span><strong>{`${creator.displayName}`}</strong> completed a thing</span>
            default:
                return <span><strong>{notification.eventType.label}</strong></span>
        }
    }

    getCircleColor() {
        const {notification} = this.props

        switch (notification.eventType.key) {
            case EventTypes.COMMENT.key:
                return '#ffd200'
            case EventTypes.CREATED.key:
                return '#448ccb'
            case EventTypes.CANCELED:
            case EventTypes.CLOSED:
            case EventTypes.DISMISSED:
                return '#ff3a4e'
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
                              onClick={() => dispatch(ThingPageActions.show(notification.thing.id))} />
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

const React = require('react')
const {Component, PropTypes} = React

const EventTypes = require('../../../common/enums/event-types')
const {PreviewItem, PreviewItemUser, PreviewItemTitle, PreviewItemDate, PreviewItemText, PreviewItemActions} =
    require('../PreviewItem/PreviewItem')
const CommentPreviewText = require('../PreviewItem/CommentPreviewText')
const PingPreviewText = require('../PreviewItem/PingPreviewText')
const ThingActionsBar = require('../Actions/ThingActionsBar')

const StatusPreviewText = ({notification}) => {
    return <span>{notification.thing.payload.status}</span>
}

class NotificationPreviewItem extends Component {

    getTextElement() {
        const {notification} = this.props

        switch (notification.eventType.key) {
            case EventTypes.COMMENT.key:
                return <CommentPreviewText comment={notification.payload.text}
                                           numOfNewComments={notification.payload.numOfNewComments} />
            case EventTypes.PING.key:
                return <PingPreviewText />
            default:
                return <StatusPreviewText notification={notification} />
        }
    }

    render() {
        const {notification} = this.props

        return (<PreviewItem>
            <PreviewItemUser>
                <span>{notification.creator.email}</span>
            </PreviewItemUser>
            <PreviewItemTitle>
                <span>{notification.thing.subject}</span>
            </PreviewItemTitle>
            <PreviewItemDate date={notification.createdAt}/>
            <PreviewItemText>
                {this.getTextElement()}
            </PreviewItemText>
            <PreviewItemActions>
                <ThingActionsBar thing={notification.thing} notification={notification} ping={false} cancel={false} />
            </PreviewItemActions>
        </PreviewItem>)
    }
}

NotificationPreviewItem.propTypes = {
    notification: PropTypes.object.isRequired
}

module.exports = NotificationPreviewItem

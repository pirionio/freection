const React = require('react')
const {PropTypes} = React

const EventTypes = require('../../../common/enums/event-types')
const {PreviewItem, PreviewItemStatus, PreviewItemTitle, PreviewItemDate, PreviewItemText, PreviewItemActions} =
    require('../Preview/PreviewItem')
const GithubActionsBar = require('./GithubActionsBar')
const TextTruncate = require('../UI/TextTruncate')
const styleVars = require('../style-vars')

const GithubPreviewItem = ({notification}) => {
    const color = notification.eventType.key === EventTypes.CREATED.key ?
        styleVars.blueCircleColor :
        styleVars.greenCircleColor
    const {creator} = notification

    const text = notification.eventType.key === EventTypes.CREATED.key ?
        <span><strong>{creator.displayName}</strong> assigned you an issue on github</span> :
        <span><strong>{creator.displayName}</strong> closed an issue on github</span>

    return (
        <PreviewItem circleColor={color}>
            <PreviewItemStatus>
                {text}
            </PreviewItemStatus>
            <PreviewItemTitle title={notification.thing.subject} href={notification.thing.payload.url} />
            <PreviewItemDate date={notification.createdAt}/>
            <PreviewItemText>
                <TextTruncate>{notification.thing.body}</TextTruncate>
            </PreviewItemText>
            <PreviewItemActions>
                <GithubActionsBar notification={notification} />
            </PreviewItemActions>
        </PreviewItem>
    )
}

GithubPreviewItem.propTypes = {
    notification: PropTypes.object.isRequired
}

module.exports = GithubPreviewItem

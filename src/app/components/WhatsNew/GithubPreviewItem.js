const React = require('react')
const {PropTypes} = React

const {PreviewItem, PreviewItemUser, PreviewItemTitle, PreviewItemDate, PreviewItemText, PreviewItemActions} =
    require('../Preview/PreviewItem')
const GithubActionsBar = require('./GithubActionsBar')
const TextTruncate = require('../UI/TextTruncate')

const GithubPreviewItem = ({notification}) => {
    return (
        <PreviewItem>
            <PreviewItemUser>
                <span>{notification.creator.displayName}</span>
            </PreviewItemUser>
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

const React = require('react')
const {PropTypes} = React

const {PreviewItem, PreviewItemUser, PreviewItemTitle, PreviewItemStatus, PreviewItemDate, PreviewItemText, PreviewItemActions} =
    require('../Preview/PreviewItem')
const GithubActionsBar = require('./GithubActionsBar')
const TextTruncate = require('../UI/TextTruncate')

const GithubTodoPreviewItem = ({thing}) => {
    return (
        <PreviewItem>
            <PreviewItemUser>
                <span>{thing.creator.displayName}</span>
            </PreviewItemUser>
            <PreviewItemTitle title={thing.subject} href={thing.payload.url} />
            <PreviewItemStatus status={thing.payload.status} />
            <PreviewItemDate date={thing.createdAt}/>
            <PreviewItemText>
                <TextTruncate>{thing.body}</TextTruncate>
            </PreviewItemText>
            <PreviewItemActions>
                <GithubActionsBar thing={thing} />
            </PreviewItemActions>
        </PreviewItem>
    )
}

GithubTodoPreviewItem.propTypes = {
    thing: PropTypes.object.isRequired
}

module.exports = GithubTodoPreviewItem

const React = require('react')
const {PropTypes} = React

const {PreviewItem, PreviewItemUser, PreviewItemTitle, PreviewItemStatus, PreviewItemDate, PreviewItemText, PreviewItemActions} =
    require('../Preview/PreviewItem')
const {ThingPreviewText, ThingPreviewTitle}= require('../Preview/Thing')
const FollowUpActionsBar = require('./FollowUpActionsBar')

const FollowUpPreviewItem = ({thing}) => {
    return (
        <PreviewItem>
            <PreviewItemUser>
                <span>{thing.to.displayName}</span>
            </PreviewItemUser>
            <PreviewItemTitle>
                <ThingPreviewTitle thing={thing} />
            </PreviewItemTitle>
            <PreviewItemStatus status={thing.payload.status} />
            <PreviewItemDate date={thing.createdAt}/>
            <PreviewItemText>
                <ThingPreviewText thing={thing} />
            </PreviewItemText>
            <PreviewItemActions>
                <FollowUpActionsBar thing={thing} />
            </PreviewItemActions>
        </PreviewItem>
    )
}

FollowUpPreviewItem.propTypes = {
    thing: PropTypes.object.isRequired
}

module.exports = FollowUpPreviewItem

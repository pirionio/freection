const React = require('react')
const {PropTypes} = React
const {connect} = require('react-redux')

const {PreviewItem, PreviewItemUser, PreviewItemTitle, PreviewItemStatus, PreviewItemDate, PreviewItemText, PreviewItemActions} =
    require('../Preview/PreviewItem')
const {ThingPreviewText}= require('../Preview/Thing')
const FollowUpActionsBar = require('./FollowUpActionsBar')
const ThingPageActions = require('../../actions/thing-page-actions')

const FollowUpPreviewItem = ({thing, dispatch}) => {
    return (
        <PreviewItem>
            <PreviewItemUser>
                <span>{thing.to.displayName}</span>
            </PreviewItemUser>
            <PreviewItemTitle title={thing.subject} onClick={() => dispatch(ThingPageActions.show(thing))} />
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

module.exports = connect()(FollowUpPreviewItem)

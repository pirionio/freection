const React = require('react')
const {PropTypes} = React
const {connect} = require('react-redux')

const {PreviewItem, PreviewItemUser, PreviewItemTitle, PreviewItemStatus, PreviewItemDate, PreviewItemText, PreviewItemActions} =
    require('../Preview/PreviewItem')
const {ThingPreviewText}= require('../Preview/Thing')
const ToDoActionsBar = require('./ToDoActionsBar')
const ThingStatus = require('../../../common/enums/thing-status')
const ThingPageActions = require('../../actions/thing-page-actions')

const TodoPreviewItem = ({thing, dispatch}) => {
    return (
        <PreviewItem>
            <PreviewItemUser>
                <span>{thing.creator.displayName}</span>
            </PreviewItemUser>
            <PreviewItemTitle title={thing.subject} onClick={() => dispatch(ThingPageActions.show(thing))} />
            <PreviewItemStatus status={ThingStatus[thing.payload.status].label} />
            <PreviewItemDate date={thing.createdAt}/>
            <PreviewItemText>
                <ThingPreviewText thing={thing} />
            </PreviewItemText>
            <PreviewItemActions>
                <ToDoActionsBar thing={thing} />
            </PreviewItemActions>
        </PreviewItem>
    )
}

TodoPreviewItem.propTypes = {
    thing: PropTypes.object.isRequired
}

module.exports = connect()(TodoPreviewItem)

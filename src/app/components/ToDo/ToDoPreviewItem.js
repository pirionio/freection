const React = require('react')
const {PropTypes} = React

const {PreviewItem, PreviewItemUser, PreviewItemTitle, PreviewItemDate, PreviewItemText, PreviewItemActions} =
    require('../Preview/PreviewItem')
const {ThingPreviewText, ThingPreviewTitle}= require('../Preview/Thing')
const ToDoActionsBar = require('./ToDoActionsBar')

const TodoPreviewItem = ({thing}) => {
    return (
        <PreviewItem>
            <PreviewItemUser>
                <span>{thing.creator.email}</span>
            </PreviewItemUser>
            <PreviewItemTitle>
                <ThingPreviewTitle thing={thing} />
            </PreviewItemTitle>
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

module.exports = TodoPreviewItem

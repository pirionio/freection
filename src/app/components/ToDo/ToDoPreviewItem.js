const React = require('react')
const {PropTypes, Component} = React
const {connect} = require('react-redux')

const {PreviewItem, PreviewItemUser, PreviewItemTitle, PreviewItemStatus, PreviewItemDate, PreviewItemText, PreviewItemActions} =
    require('../Preview/PreviewItem')
const {ThingPreviewText}= require('../Preview/Thing')
const ToDoActionsBar = require('./ToDoActionsBar')
const ThingStatus = require('../../../common/enums/thing-status')
const ThingPageActions = require('../../actions/thing-page-actions')
const styleVars = require('../style-vars')

class TodoPreviewItem extends Component {
    getCircleColor() {
        const {thing} = this.props

        switch (thing.payload.status) {
            case ThingStatus.CLOSE.key:
            case ThingStatus.DISMISS.key:
                return styleVars.redCircleColor
            case ThingStatus.NEW.key:
            case ThingStatus.INPROGRESS.key:
            case ThingStatus.REOPENED.key:
                return styleVars.blueCircleColor
            case ThingStatus.DONE.key:
                return styleVars.greenCircleColor
        }
    }

    render() {
        const {thing, dispatch} = this.props

        return (
            <PreviewItem circleColor={this.getCircleColor()}>
                <PreviewItemTitle title={thing.subject}
                                  onClick={() => dispatch(ThingPageActions.show(thing))}/>
                <PreviewItemStatus>
                    <strong>{thing.creator.displayName}</strong>
                </PreviewItemStatus>
                <PreviewItemDate date={thing.createdAt}/>
                <PreviewItemText>
                    <ThingPreviewText thing={thing}/>
                </PreviewItemText>
                <PreviewItemActions>
                    <ToDoActionsBar thing={thing}/>
                </PreviewItemActions>
            </PreviewItem>
        )
    }
}

TodoPreviewItem.propTypes = {
    thing: PropTypes.object.isRequired
}

module.exports = connect()(TodoPreviewItem)

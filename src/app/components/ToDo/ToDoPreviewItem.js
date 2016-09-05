const React = require('react')
const {PropTypes, Component} = React
const {connect} = require('react-redux')

import ThingStatus from '../../../common/enums/thing-status'
const ThingPageActions = require('../../actions/thing-page-actions')
const ThingHelper = require('../../helpers/thing-helper')

const {PreviewItem, PreviewItemUser, PreviewItemText, PreviewItemActions} = require('../Preview/PreviewItem')
const {ThingPreviewText}= require('../Preview/Thing')
const ToDoActionsBar = require('./ToDoActionsBar')
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

    getExpandedMessages() {
        const {thing} = this.props
        const unreadEvents = ThingHelper.getUnreadMessages(thing)
        return unreadEvents && unreadEvents.length ? unreadEvents : [ThingHelper.getLastMessage(thing)]
    }

    render() {
        const {thing, dispatch} = this.props

        const textPreview = <ThingPreviewText thing={thing}/>

        return (
            <PreviewItem circleColor={this.getCircleColor()}
                         title={thing.subject}
                         date={thing.createdAt}
                         expandedMessages={this.getExpandedMessages()}
                         onClick={() => dispatch(ThingPageActions.showThingPage(thing))}>
                <PreviewItemUser>
                    <strong>{thing.creator.displayName}</strong>
                </PreviewItemUser>
                <PreviewItemText>{textPreview}</PreviewItemText>
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

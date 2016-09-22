import React,{PropTypes, Component} from 'react'
import {connect} from 'react-redux'

import ThingStatus from '../../../common/enums/thing-status'
import * as ThingPageActions from '../../actions/thing-page-actions'
import * as ThingHelper from '../../helpers/thing-helper'
import PreviewItem, {PreviewItemStatus, PreviewItemText, PreviewItemActions} from '../Preview/PreviewItem'
import {ThingPreviewText} from '../Preview/Thing'
import ToDoActionsBar from './ToDoActionsBar'
import styleVars from '../style-vars'

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
                <PreviewItemStatus>
                    <strong>{thing.creator.displayName}</strong>
                </PreviewItemStatus>
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

export default connect()(TodoPreviewItem)

import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'

import * as ThingPageActions from '../../actions/thing-page-actions'
import ThingStatus from '../../../common/enums/thing-status'
import * as ThingHelper from '../../helpers/thing-helper'
import PreviewItem, { PreviewItemStatus, PreviewItemText, PreviewItemActions} from '../Preview/PreviewItem'
import {ThingPreviewText} from '../Preview/Thing'
import FollowUpActionsBar from './FollowUpActionsBar'
import styleVars from '../style-vars'

class FollowUpPreviewItem extends Component {
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

    getStatusText() {
        const {thing} = this.props

        switch(thing.payload.status) {
            case ThingStatus.INPROGRESS.key:
                return <span>It's in <strong>{thing.to.displayName}</strong> todo list</span>
            case ThingStatus.NEW.key:
            case ThingStatus.REOPENED.key:
                return <span>It's still in <strong>{thing.to.displayName}</strong> what's new</span>
            case ThingStatus.DONE.key:
                return <span><strong>{thing.to.displayName}</strong> completed the thing</span>
            case ThingStatus.DISMISS.key:
                return <span><strong>{thing.to.displayName}</strong> dismissed the thing</span>

            default:
                return <strong>{thing.to.displayName}</strong>
        }
    }

    getExpandedMessages() {
        const {thing} = this.props
        const unreadEvents = ThingHelper.getUnreadMessages(thing)
        return unreadEvents && unreadEvents.length ? unreadEvents : [ThingHelper.getLastMessage(thing)]
    }

    render() {
        const {thing, dispatch} = this.props

        return (
            <PreviewItem circleColor={this.getCircleColor()}
                         title={thing.subject}
                         date={thing.createdAt}
                         expandedMessages={this.getExpandedMessages()}
                         onClick={() => dispatch(ThingPageActions.show(thing))}>
                <PreviewItemStatus>
                    {this.getStatusText()}
                </PreviewItemStatus>
                <PreviewItemText>
                    <ThingPreviewText thing={thing}/>
                </PreviewItemText>
                <PreviewItemActions>
                    <FollowUpActionsBar thing={thing}/>
                </PreviewItemActions>
            </PreviewItem>
        )
    }
}

FollowUpPreviewItem.propTypes = {
    thing: PropTypes.object.isRequired
}

export default connect()(FollowUpPreviewItem)

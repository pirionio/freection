import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'

import * as ThingPageActions from '../../actions/thing-page-actions'
import ThingStatus from '../../../common/enums/thing-status'
import * as ThingHelper from '../../../common/helpers/thing-helper'
import PreviewItem, { PreviewItemStatus, PreviewItemText, PreviewItemActions} from '../Preview/PreviewItem'
import {ThingPreviewText} from '../Preview/Thing'
import styleVars from '../style-vars'
import CommandBar from '../Commands/CommandsBar.js'

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
                return <span>In <strong>{thing.to.displayName}</strong> To Do list</span>
            case ThingStatus.NEW.key:
            case ThingStatus.REOPENED.key:
                return <span>Still in <strong>{thing.to.displayName}</strong> Inbox</span>
            case ThingStatus.DONE.key:
                return <span><strong>{thing.to.displayName}</strong> completed the task</span>
            case ThingStatus.DISMISS.key:
                return <span><strong>{thing.to.displayName}</strong> dismissed the task</span>

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
        const {thing, commands, dispatch} = this.props

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
                    <CommandBar thing={thing} commands={commands} />
                </PreviewItemActions>
            </PreviewItem>
        )
    }
}

FollowUpPreviewItem.propTypes = {
    thing: PropTypes.object.isRequired,
    commands: PropTypes.array.isRequired
}

export default connect()(FollowUpPreviewItem)

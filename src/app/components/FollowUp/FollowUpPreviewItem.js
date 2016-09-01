const React = require('react')
const {PropTypes, Component} = React
const {connect} = require('react-redux')

const ThingPageActions = require('../../actions/thing-page-actions')
import ThingStatus from '../../../common/enums/thing-status'
const ThingHelper = require('../../helpers/thing-helper')

const {PreviewItem, PreviewItemStatus, PreviewItemText, PreviewItemActions} = require('../Preview/PreviewItem')
const {ThingPreviewText}= require('../Preview/Thing')
const FollowUpActionsBar = require('./FollowUpActionsBar')
const styleVars = require('../style-vars')

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
                         onClick={() => dispatch(ThingPageActions.showThingPage(thing))}>
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

module.exports = connect()(FollowUpPreviewItem)

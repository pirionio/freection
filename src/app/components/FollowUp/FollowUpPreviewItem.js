const React = require('react')
const {PropTypes, Component} = React
const {connect} = require('react-redux')

const ThingPageActions = require('../../actions/thing-page-actions')
const ThingStatus = require('../../../common/enums/thing-status')
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
                    <strong>{thing.to.displayName}</strong>
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

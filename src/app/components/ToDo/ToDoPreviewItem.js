const React = require('react')
const {Component, PropTypes} = React
const first = require('lodash/first')
const last = require('lodash/last')
const includes = require('lodash/includes')
const chain = require('lodash/core')

const EventTypes = require('../../../common/enums/event-types')
const {PreviewItem, PreviewItemUser, PreviewItemTitle, PreviewItemDate, PreviewItemText, PreviewItemActions} =
    require('../PreviewItem/PreviewItem')
const CommentPreviewText = require('../PreviewItem/CommentPreviewText')
const PingPreviewText = require('../PreviewItem/PingPreviewText')
const BodyPreviewText = require('../PreviewItem/BodyPreviewText')
const ThingPreviewTitle = require('../PreviewItem/ThingPreviewTitle')
const ThingActionsBar = require('../Actions/ThingActionsBar')

class TodoPreviewItem extends Component {

    filterEventsByRead(isRead) {
        const {thing} = this.props
        return chain(thing.events)
            .filter(event => includes([EventTypes.COMMENT.key, EventTypes.PING.key], event.eventType.key) && event.payload.isRead === isRead)
            .sortBy('createdAt')
            .value()
    }

    getTextElement() {
        const {thing} = this.props
        const unreadEvents = this.filterEventsByRead(false)
        const readEvents = this.filterEventsByRead(true)

        // If there are unread events, show the first of them.
        if (unreadEvents && unreadEvents.length) {
            const firstComment = first(unreadEvents)

            if (firstComment.eventType.key === EventTypes.PING.key) {
                return <PingPreviewText numOfNewComments={unreadEvents.length} />
            } else {
                return <CommentPreviewText comment={firstComment.payload.text}
                                           numOfNewComments={unreadEvents.length}/>
            }
        }

        // If there are only read events, show the last of them.
        if (readEvents && readEvents.length) {
            const lastComment = last(readEvents)

            if (lastComment.eventType.key === EventTypes.PING.key) {
                return <PingPreviewText />
            } else {
                return <CommentPreviewText comment={lastComment.payload.text} />
            }
        }
        
        return <BodyPreviewText body={thing.body} />
    }

    render() {
        const {thing} = this.props

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
                    {this.getTextElement()}
                </PreviewItemText>
                <PreviewItemActions>
                    <ThingActionsBar thing={thing} ping={false} cancel={false} />
                </PreviewItemActions>
            </PreviewItem>
        )
    }
}

TodoPreviewItem.propTypes = {
    thing: PropTypes.object.isRequired
}

module.exports = TodoPreviewItem

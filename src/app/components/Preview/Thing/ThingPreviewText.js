const React = require('react')
const {PropTypes} = React
const first = require('lodash/first')
const last = require('lodash/last')
const includes = require('lodash/includes')
const chain = require('lodash/core')

const EventTypes = require('../../../../common/enums/event-types')
const CommentPreviewText = require('./CommentPreviewText')
const PingPreviewText = require('./PingPreviewText')
const BodyPreviewText = require('./BodyPreviewText')

function filterEventsByRead(thing, isRead) {
    return chain(thing.events)
        .filter(event => [EventTypes.COMMENT.key, EventTypes.PING.key, EventTypes.PONG.key].includes(event.eventType.key) && event.payload.isRead === isRead)
        .sortBy('createdAt')
        .value()
}

const ThingPreviewText = ({thing}) =>  {
    const unreadEvents = filterEventsByRead(thing, false)
    const readEvents = filterEventsByRead(thing, true)

    // If there are unread events, show the first of them.
    if (unreadEvents && unreadEvents.length) {
        const firstComment = first(unreadEvents)

        if (firstComment.eventType.key === EventTypes.PING.key) {
            return <PingPreviewText numOfNewComments={unreadEvents.length}/>
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
            return <CommentPreviewText comment={lastComment.payload.text}/>
        }
    }

    return <BodyPreviewText body={thing.body}/>
}
ThingPreviewText.propTypes = {
    thing: PropTypes.object.isRequired
}

module.exports = ThingPreviewText

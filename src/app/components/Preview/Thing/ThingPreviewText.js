const React = require('react')
const {PropTypes} = React
const first = require('lodash/first')
const last = require('lodash/last')

const EventTypes = require('../../../../common/enums/event-types')
const ThingHelper = require('../../../helpers/thing-helper')

const CommentPreviewText = require('./CommentPreviewText')
const PingPreviewText = require('./PingPreviewText')

const ThingPreviewText = ({thing}) =>  {
    const unreadEvents = ThingHelper.getUnreadMessages(thing)
    const readEvents = ThingHelper.getReadMessages(thing)

    // If there are unread events, show the first of them.
    if (unreadEvents && unreadEvents.length) {
        const firstComment = first(unreadEvents)

        if (firstComment.eventType.key === EventTypes.PING.key) {
            return <PingPreviewText newNotifications={unreadEvents}/>
        } else {
            return <CommentPreviewText comment={firstComment.payload.text}
                                       newNotifications={unreadEvents}/>
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

    return <span></span>
}
ThingPreviewText.propTypes = {
    thing: PropTypes.object.isRequired
}

module.exports = ThingPreviewText

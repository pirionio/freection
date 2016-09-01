const React = require('react')
const {PropTypes} = React
const first = require('lodash/first')
const last = require('lodash/last')

import EventTypes from '../../../../common/enums/event-types'
const ThingHelper = require('../../../helpers/thing-helper')

const CommentPreviewText = require('./CommentPreviewText')
const PingPreviewText = require('./PingPreviewText')
const TextSeparator = require('../../UI/TextSeparator')
const Flexbox = require('../../UI/Flexbox')

const ThingPreviewText = ({thing}) =>  {
    const unreadEvents = ThingHelper.getUnreadMessages(thing)
    const readEvents = ThingHelper.getReadMessages(thing)

    let text = null

    if (unreadEvents && unreadEvents.length) {
        // If there are unread events, show the first of them.
        const firstComment = first(unreadEvents)

        if (firstComment.eventType.key === EventTypes.PING.key) {
            text = <PingPreviewText newNotifications={unreadEvents}/>
        } else {
            text = <CommentPreviewText comment={firstComment.payload.text}
                                       newNotifications={unreadEvents}/>
        }
    } else if (readEvents && readEvents.length) {
        // If there are only read events, show the last of them.
        const lastComment = last(readEvents)

        if (lastComment.eventType.key === EventTypes.PING.key) {
            text = <PingPreviewText />
        } else {
            text = <CommentPreviewText comment={lastComment.payload.text}/>
        }
    }

    if (text) {
        return (
            <Flexbox container="row">
                <Flexbox shrink={0}><TextSeparator /></Flexbox>
                <Flexbox grow={1} style={{minWidth: 0}}>{text}</Flexbox>
            </Flexbox>)
    }

    return null
}
ThingPreviewText.propTypes = {
    thing: PropTypes.object.isRequired
}

module.exports = ThingPreviewText

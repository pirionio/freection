import React, {PropTypes} from 'react'
import useSheet from 'react-jss'
import first from 'lodash/first'
import last from 'lodash/last'

import EventTypes from '../../../../common/enums/event-types'
import * as ThingHelper from '../../../helpers/thing-helper'
import CommentPreviewText from './CommentPreviewText'
import PingPreviewText from './PingPreviewText'
import TextSeparator from '../../UI/TextSeparator'
import Flexbox from '../../UI/Flexbox'

const ThingPreviewText = ({thing, sheet: {classes}}) =>  {
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
                <Flexbox grow={1} className={classes.textRow}>{text}</Flexbox>
            </Flexbox>)
    }

    return null
}

const style = {
    textRow: {
        minWidth: 0
    }
}

ThingPreviewText.propTypes = {
    thing: PropTypes.object.isRequired
}

export default useSheet(ThingPreviewText, style)

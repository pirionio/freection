import {chain} from 'lodash/core'
import last from 'lodash/last'
import groupBy from 'lodash/groupBy'
import first from 'lodash/first'
import merge from 'lodash/merge'
import reject from 'lodash/reject'
import forOwn from 'lodash/forOwn'
import clone from 'lodash/clone'

import SharedConstants from '../../common/shared-constants'
import EventTypes from '../../common/enums/event-types'

export function getAllMessages(thing) {
    return chain(thing.events)
        .filter(event => SharedConstants.MESSAGE_TYPED_EVENTS.includes(event.eventType.key))
        .sortBy('createdAt')
        .value()
}

export function getUnreadMessages(thing) {
    return filterEventsByRead(thing, false)
}

export function getInitialUnreadMessages(thing) {
    return filterEventsByRead(thing, false, 'initialIsRead')
}

export function getReadMessages(thing) {
    return filterEventsByRead(thing, true)
}

export function getLastMessage(thing) {
    return last(getAllMessages(thing))
}

export function groupNotificationsByThing(notifications) {
    const notificationsByThing = groupBy(notifications, notification => notification.thing.id)

    const aggregatedNotifications = []

    // We want to aggregate notifications that belong to the very same thing. That's why we grouped them according to Thing.
    forOwn(notificationsByThing, thingNotifications => {
        const commentNotifications = chain(thingNotifications)
            .filter(notification => SharedConstants.EVENTS_TO_GROUP.includes(notification.eventType.key))
            .sortBy('createdAt')
            .value()

        if (commentNotifications && commentNotifications.length) {
            const oldest = first(commentNotifications)
            const newest = last(commentNotifications)

            // Notice below how the createdAt field will be taken from the newest comment we found.
            // That's because if indeed many comments arrived, we'd like the final aggregated notification to be ordered among all other notifications
            // based on the last comment that arrived. The text, however, of the notification, will be that of the FIRST comment that arrived.
            aggregatedNotifications.push(merge(clone(oldest), {
                payload: {
                    newNotifications: commentNotifications
                },
                createdAt: newest ? newest.createdAt : oldest.createdAt
            }))
        }

        // Here we add the rest of the notifications.
        aggregatedNotifications.push(...reject(thingNotifications, notification =>
            SharedConstants.EVENTS_TO_GROUP.includes(notification.eventType.key)
        ))
    })

    return aggregatedNotifications && aggregatedNotifications.length ? aggregatedNotifications : []
}

function filterEventsByRead(thing, isRead, isReadField='isRead') {
    return chain(thing.events)
        .filter(event => {
            return SharedConstants.MESSAGE_TYPED_EVENTS.includes(event.eventType.key) &&
                (event.eventType.key !== EventTypes.PING.key ? (event.payload.text || event.payload.html) : true) &&
                event.payload[isReadField] === isRead
        })
        .sortBy('createdAt')
        .value()
}
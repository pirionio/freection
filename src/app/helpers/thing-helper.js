import {chain} from 'lodash/core'
import last from 'lodash/last'

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
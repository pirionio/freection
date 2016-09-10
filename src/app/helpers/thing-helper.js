import {chain} from 'lodash/core'
import last from 'lodash/last'

import SharedConstants from '../../common/shared-constants'

export function getAllMessages(thing) {
    return chain(thing.events)
        .filter(event => SharedConstants.MESSAGE_TYPED_EVENTS.includes(event.eventType.key))
        .sortBy('createdAt')
        .value()
}

export function getUnreadMessages(thing) {
    return filterEventsByRead(thing, false)
}

export function getReadMessages(thing) {
    return filterEventsByRead(thing, true)
}

export function getLastMessage(thing) {
    return last(getAllMessages(thing))
}

function filterEventsByRead(thing, isRead) {
    return chain(thing.events)
        .filter(event => SharedConstants.MESSAGE_TYPED_EVENTS.includes(event.eventType.key) &&
                (event.payload.text || event.payload.html) && event.payload.isRead === isRead)
        .sortBy('createdAt')
        .value()
}
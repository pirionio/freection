const chain = require('lodash/core')
const last = require('lodash/last')

const {SharedConstants} = require('../../common/shared-constants')

function getAllMessages(thing) {
    return chain(thing.events)
        .filter(event => SharedConstants.MESSAGE_TYPED_EVENTS.includes(event.eventType.key))
        .sortBy('createdAt')
        .value()
}

function getUnreadMessages(thing) {
    return filterEventsByRead(thing, false)
}

function getReadMessages(thing) {
    return filterEventsByRead(thing, true)
}

function getLastMessage(thing) {
    return last(getAllMessages(thing))
}

function filterEventsByRead(thing, isRead) {
    return chain(thing.events)
        .filter(event => SharedConstants.MESSAGE_TYPED_EVENTS.includes(event.eventType.key) && event.payload.isRead === isRead)
        .sortBy('createdAt')
        .value()
}

module.exports = {
    getAllMessages,
    getUnreadMessages,
    getReadMessages,
    getLastMessage
}
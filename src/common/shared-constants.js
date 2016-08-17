const EventTypes = require('./enums/event-types')

const SharedConstants = {
    MESSAGE_TYPED_EVENTS: [EventTypes.COMMENT.key, EventTypes.CREATED.key, EventTypes.PING.key, EventTypes.PONG.key]
}

module.exports = {
    SharedConstants
}
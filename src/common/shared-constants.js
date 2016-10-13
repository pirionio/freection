import EventTypes from './enums/event-types'

export default {
    MESSAGE_TYPED_EVENTS: [EventTypes.COMMENT.key, EventTypes.CREATED.key, EventTypes.PING.key, EventTypes.PONG.key, EventTypes.DONE.key,
        EventTypes.DISMISSED.key, EventTypes.CLOSED.key, EventTypes.SENT_BACK.key],

    EVENTS_TO_GROUP: [EventTypes.CREATED.key, EventTypes.COMMENT.key, EventTypes.MENTIONED.key],

    DEFAULT_BASE_URL: 'https://freection.com',

    MENTION_REGEX: /(^|\s+)@([\w\.]+)/gm
}
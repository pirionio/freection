import EventTypes from './enums/event-types'
import TodoTimeCategory from './enums/todo-time-category'

export default {
    MESSAGE_TYPED_EVENTS: [EventTypes.COMMENT.key, EventTypes.CREATED.key, EventTypes.PING.key, EventTypes.PONG.key, EventTypes.DONE.key,
        EventTypes.DISMISSED.key, EventTypes.CLOSED.key, EventTypes.SENT_BACK.key],

    EVENTS_TO_GROUP: [EventTypes.CREATED.key, EventTypes.COMMENT.key],

    DEFAULT_TODO_TIME_CATEGORY: TodoTimeCategory.LATER,

    DEFAULT_FOLLOWUP_TO_CATEGORY: 'Other',
    
    DEFAULT_BASE_URL: 'https://app.freection.com',

    MENTION_REGEX: /(^|\s+)@([\w\.]+)/gm
}
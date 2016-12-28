import EventTypes from './enums/event-types'
import TodoTimeCategory from './enums/todo-time-category'
import WelcomeStatus from './enums/welcome-status'

export default {
    MESSAGE_TYPED_EVENTS: [EventTypes.COMMENT.key, EventTypes.CREATED.key, EventTypes.PING.key, EventTypes.PONG.key, EventTypes.DONE.key,
        EventTypes.DISMISSED.key, EventTypes.CLOSED.key, EventTypes.SENT_BACK.key],

    EVENTS_TO_GROUP: [EventTypes.CREATED.key, EventTypes.COMMENT.key],

    DEFAULT_TODO_TIME_CATEGORY: TodoTimeCategory.LATER,

    DEFAULT_FOLLOWUP_TO_CATEGORY: 'Other',
    
    WELCOME_WIZARD_STEPS: [
        WelcomeStatus.INTRO,  
        WelcomeStatus.INTEGRATIONS,  
        WelcomeStatus.HOWTO,  
        WelcomeStatus.DONE  
    ],
    
    DEFAULT_BASE_URL: 'https://app.freection.com',

    DEFAULT_LOG_LEVEL: 'info',

    MENTION_REGEX: /(^|\s+)@([\w\.]+)/gm
}
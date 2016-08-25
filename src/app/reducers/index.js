const {combineReducers} = require('redux')
const whatsNew = require('./whats-new-reducer')
const unreadEmails = require('./unread-emails-reducer')
const toDo = require('./to-do-reducer')
const followUps = require('./follow-ups-reducer')
const messagePanel = require('./message-panel-reducer')
const {messageBox, messageBoxForm} = require('./message-box-reducer')
const {inlineMessage, inlineMessageForm} = require('./inline-message-reducer')
const thingPage = require('./thing-page-reducer')
const emailPage = require('./email-page-reducer')
const github = require('./github')
const auth = require('./auth')
const contacts = require('./contacts-reducer')
const glassPane = require('./glass-pane-reducer')
const { routerReducer } = require('react-router-redux')

module.exports = combineReducers({
    whatsNew,
    toDo,
    followUps,
    messagePanel,
    messageBox,
    messageBoxForm,
    inlineMessage,
    inlineMessageForm,
    thingPage,
    unreadEmails,
    emailPage,
    github,
    auth,
    contacts,
    glassPane,
    routing: routerReducer,
    config: (state = {}) => state
})

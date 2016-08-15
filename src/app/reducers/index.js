const {combineReducers} = require('redux')
const whatsNew = require('./whats-new-reducer')
const unreadEmails = require('./unread-emails-reducer')
const toDo = require('./to-do-reducer')
const followUps = require('./follow-ups-reducer')
const messagePanel = require('./message-panel-reducer')
const {messageBox, messageBoxForm} = require('./message-box-reducer')
const thingPage = require('./thing-page-reducer')
const emailPage = require('./email-page-reducer')
const github = require('./github')
const auth = require('./auth')
const { routerReducer } = require('react-router-redux')

module.exports = combineReducers({
    whatsNew,
    toDo,
    followUps,
    messagePanel,
    messageBox,
    messageBoxForm,
    thingPage,
    unreadEmails,
    emailPage,
    github,
    auth,
    routing: routerReducer
})

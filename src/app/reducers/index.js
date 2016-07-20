const {combineReducers} = require('redux')
const whatsNew = require('./whats-new-reducer')
const toDo = require('./to-do-reducer')
const {messageBox, messageBoxForm} = require('./message-box-reducer')
const followUps = require('./follow-ups-reducer')
const showTask = require('./show-task-reducer')
const auth = require('./auth')

module.exports = combineReducers({
    whatsNew,
    toDo,
    followUps,
    messageBox,
    messageBoxForm,
    showTask,
    auth
})

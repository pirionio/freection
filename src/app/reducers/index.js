const {combineReducers} = require('redux')
const whatsNew = require('./whats-new-reducer')
const toDo = require('./to-do-reducer')
const {messageBox, messageBoxForm} = require('./message-box-reducer')
const followUps = require('./follow-ups-reducer')
const thingPage = require('./thing-page-reducer')
const auth = require('./auth')
const { routerReducer } = require('react-router-redux')

module.exports = combineReducers({
    whatsNew,
    toDo,
    followUps,
    messageBox,
    messageBoxForm,
    thingPage,
    auth,
    routing: routerReducer
})

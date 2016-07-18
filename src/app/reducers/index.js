const {combineReducers} = require('redux')
const whatsNew = require('./whats-new-reducer')
const toDo = require('./to-do-reducer')
const {newThing, newThingForm} = require('./new-thing-reducer')
const followUps = require('./follow-ups-reducer')
const showTask = require('./show-task-reducer')
const auth = require('./auth')

module.exports = combineReducers({
    whatsNew,
    toDo,
    followUps,
    newThing,
    newThingForm,
    showTask,
    auth
})

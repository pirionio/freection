const {combineReducers} = require('redux')
const formReducer = require('redux-form').reducer
const whatsNew = require('./whats-new-reducer')
const toDo = require('./to-do-reducer')
const {newThing, newThingForm} = require('./new-thing-reducer')
const followUps = require('./follow-ups-reducer')
const auth = require('./auth')

module.exports = combineReducers({
    whatsNew,
    toDo,
    followUps,
    newThing,
    newThingForm,
    auth,
    form: formReducer
})

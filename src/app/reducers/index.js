const {combineReducers} = require('redux')
const whatsNew = require('./whats-new-reducer')
const toDo = require('./to-do-reducer')
const newThing = require('./new-thing-reducer')
const followUps = require('./follow-ups-reducer')
const auth = require('./auth')

module.exports = combineReducers({
    whatsNew, toDo, newThing, followUps, auth
})

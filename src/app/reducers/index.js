const {combineReducers} = require('redux')
const whatsNew = require('./whats-new-reducer')
const newThing = require('./new-thing-reducer')
const auth = require('./auth')

module.exports = combineReducers({
    whatsNew, newThing, auth
})

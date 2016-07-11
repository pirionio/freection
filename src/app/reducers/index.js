const {combineReducers} = require('redux')
const whatsNew = require('./whats-new-reducer')
const NewThing = require('./new-thing-reducer')
const auth = require('./auth')

module.exports = combineReducers({
    whatsNew, NewThing, auth
})

const {combineReducers} = require('redux')
const whatsNew = require('./whats-new-reducer')
const auth = require('./auth')

module.exports = combineReducers({
    whatsNew, auth
})

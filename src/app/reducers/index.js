const {combineReducers} = require('redux')
const whatsNew = require('./whats-new-reducer')
const toDo = require('./to-do-reducer')
const {newThingBox, newThingBoxForm} = require('./new-thing-box-reducer')
const {commentThingBox, commentThingBoxForm} = require('./comment-thing-box-reducer')
const followUps = require('./follow-ups-reducer')
const thingPage = require('./thing-page-reducer')
const unreadEmails = require('./unread-emails-reducer')
const emailPage = require('./email-page-reducer')
const github = require('./github')
const auth = require('./auth')
const { routerReducer } = require('react-router-redux')

module.exports = combineReducers({
    whatsNew,
    toDo,
    followUps,
    newThingBox,
    newThingBoxForm,
    commentThingBox,
    commentThingBoxForm,
    thingPage,
    unreadEmails,
    emailPage,
    github,
    auth,
    routing: routerReducer
})

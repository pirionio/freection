import {combineReducers} from 'redux'
import { routerReducer } from 'react-router-redux'

import whatsNew from './whats-new-reducer'
import unreadEmails from './unread-emails-reducer'
import toDo from './to-do-reducer'
import followUps from './follow-ups-reducer'
import messagePanel from './message-panel-reducer'
import {messageBox, messageBoxForm} from './message-box-reducer'
import {inlineMessage, inlineMessageForm} from './inline-message-reducer'
import thingPage from './thing-page-reducer'
import emailPage from './email-page-reducer'
import github from './github'
import auth from './auth'
import contacts from './contacts-reducer'
import glassPane from './glass-pane-reducer'

export default combineReducers({
    whatsNew,
    toDo,
    followUps,
    messagePanel,
    messageBox,
    messageBoxForm,
    inlineMessage,
    inlineMessageForm,
    thingPage,
    unreadEmails,
    emailPage,
    github,
    auth,
    contacts,
    glassPane,
    routing: routerReducer,
    config: (state = {}) => state
})

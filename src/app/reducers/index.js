import {combineReducers} from 'redux'
import { routerReducer } from 'react-router-redux'

import whatsNew from './whats-new-reducer'
import unreadEmails from './unread-emails-reducer'
import toDo from './to-do-reducer'
import followUps from './follow-ups-reducer'
import mentions from './mention-reducer'
import allThings from './all-things-reducer'
import messagePanel from './message-panel-reducer'
import expandedMessageBox from './expanded-message-box-reducer'
import {messageBox, messageBoxForm} from './message-box-reducer'
import {inlineMessage, inlineMessageForm} from './inline-message-reducer'
import thingPage from './thing-page-reducer'
import emailPage from './email-page-reducer'
import github from './github'
import slack from './slack'
import auth from './auth'
import to from './to-reducer'
import users from './users-reducer'
import glassPane from './glass-pane-reducer'

export default combineReducers({
    whatsNew,
    toDo,
    followUps,
    mentions,
    allThings,
    messagePanel,
    expandedMessageBox,
    messageBox,
    messageBoxForm,
    inlineMessage,
    inlineMessageForm,
    thingPage,
    unreadEmails,
    emailPage,
    github,
    slack,
    auth,
    to,
    users,
    glassPane,
    routing: routerReducer,
    config: (state = {}) => state
})

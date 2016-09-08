import uniqueId from 'lodash/uniqueId'
import find from 'lodash/find'

import MessageBoxActionTypes from '../actions/types/message-box-action-types'
import ThingPageActionTypes from '../actions/types/thing-page-action-types'
import EmailPageActionTypes from '../actions/types/email-page-action-types'
import immutable from '../util/immutable'
import {ActionStatus} from '../constants'
import MessageTypes from '../../common/enums/message-types'

const initialState = {
    messageBoxes: [],
    activeMessageBoxId: null
}

function newMessageBox(state, action) {
    // This is sad, but when there's a new message box for reply to email, we don't have the full object of the email's thread,
    // so we can't really add the new message box, with the right context.
    // We'd have to wait for a GET on the whole thread to occur, and only then create the message box.
    if (action.messageType.key === MessageTypes.REPLY_EMAIL.key)
        return state
    
    const messageBox = {
        id: uniqueId(),
        type: action.messageType,
        title: action.context ? action.context.subject : action.messageType.label,
        context: action.context,
        ongoingAction: false
    }

    return immutable(state)
        .arrayPushItem('messageBoxes', messageBox)
        .value()
}

function newMessageInThing(state, action) {
    return newMessageInContext(state, action, MessageTypes.COMMENT_THING, 'thing')
}

function newMessageInEmail(state, action) {
    return newMessageInContext(state, action, MessageTypes.REPLY_EMAIL, 'thread')
}

function newMessageInContext(state, action, type, contextField) {
    switch (action.status) {
        case ActionStatus.COMPLETE:
            const existingMessageBox = find(state.messageBoxes, {context: {id: action[contextField].id}})
            if (existingMessageBox)
                return immutable(state)
                    .arrayMergeItem('messageBoxes', {id: existingMessageBox.id}, {context: action[contextField]})
                    .value()

            const messageBox = {
                id: uniqueId(),
                type,
                title: action[contextField].subject,
                context: action[contextField],
                ongoingAction: false
            }
            return immutable(state)
                .arrayPushItem('messageBoxes', messageBox)
                .set('activeMessageBoxId', messageBox.id)
                .value()
        default:
            return state
    }
}

function closeMessageBox(state, action) {
    return immutable(state)
        .arrayReject('messageBoxes', {id: action.messageBoxId})
        .value()
}

function selectMessageBox(state, action) {
    return immutable(state)
        .arrayMergeItem('messageBoxes', {id: action.currentMessageBoxId}, {message: action.currentMessage})
        .set('activeMessageBoxId', action.selectedMessageBoxId)
        .value()
}

function messageSent(state, action) {
    switch (action.status) {
        case ActionStatus.START:
            return immutable(state)
                .arrayMergeItem('messageBoxes', {id: action.messageBoxId}, {ongoingAction: true})
                .value()
        case ActionStatus.COMPLETE:
            if (!action.shouldCloseMessageBox)
                return immutable(state)
                    .arrayMergeItem('messageBoxes', {id: action.messageBoxId}, {ongoingAction: false, message: {}})
                    .value()

            return immutable(state)
                .arrayReject('messageBoxes', {id: action.messageBoxId})
                .set('activeMessageBoxId', state.messageBoxes.length > 1 ? state.messageBoxes[1].id : null)
                .value()
        default:
            return state
    }
}

function setFocus(state, action) {
    return immutable(state)
        .arrayMergeItem('messageBoxes', {id: action.messageBoxId}, {focusOn: action.focusOn})
        .value()
}

export default (state = initialState, action) => {
    switch (action.type) {
        case MessageBoxActionTypes.NEW_MESSAGE_BOX:
            return newMessageBox(state, action)
        case MessageBoxActionTypes.CLOSE_MESSAGE_BOX:
            return closeMessageBox(state, action)
        case MessageBoxActionTypes.SELECT_MESSAGE_BOX:
            return selectMessageBox(state, action)
        case MessageBoxActionTypes.MESSAGE_SENT:
            return messageSent(state, action)
        case MessageBoxActionTypes.SET_FOCUS:
            return setFocus(state, action)
        case ThingPageActionTypes.GET_THING:
            return newMessageInThing(state, action)
        case EmailPageActionTypes.GET_EMAIL:
            return newMessageInEmail(state, action)
        default:
            return state
    }
}
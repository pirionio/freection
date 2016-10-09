import uniqueId from 'lodash/uniqueId'

import MessageBoxActionTypes from '../actions/types/message-box-action-types'
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
        title: getMessageBoxTitle(action),
        context: action.context,
        ongoingAction: false,
        editorState: null,
        action: action.sendAction
    }

    return immutable(state)
        .arrayPushItem('messageBoxes', messageBox)
        .value()
}

function getMessageBoxTitle(action) {
    if (action.title)
        return action.title

    if (action.context)
        return action.context.subject

    return action.messageType.label
}

function closeMessageBox(state, action) {
    return immutable(state)
        .arrayReject('messageBoxes', {id: action.messageBoxId})
        .value()
}

function selectMessageBox(state, action) {
    return immutable(state)
        .arrayMergeItem('messageBoxes', {id: action.currentMessageBoxId}, {message: action.currentMessage, editorState: action.editorState})
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
        default:
            return state
    }
}
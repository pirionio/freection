import MessageBoxActionsTypes from '../types/message-box-action-types'
import {ActionStatus} from '../../constants'
import * as ResourceUtil from '../../util/resource-util'

export function _newMessageBox(messageType,context,sendAction,title) {
    return {
        type: MessageBoxActionsTypes.NEW_MESSAGE_BOX,
        messageType,
        context,
        sendAction,
        title
    }
}

export function _selectMessageBox(currentMessageBoxId,selectedMessageBoxId,currentMessage,editorState) {
    return {
        type: MessageBoxActionsTypes.SELECT_MESSAGE_BOX,
        currentMessageBoxId,
        selectedMessageBoxId,
        currentMessage,
        editorState
    }
}

export function messageSent(messageBoxId) {
    return {
        type: MessageBoxActionsTypes.MESSAGE_SENT,
        messageBoxId
    }
}

export function _closeMessageBox(messageBoxId) {
    return {
        type: MessageBoxActionsTypes.CLOSE_MESSAGE_BOX,
        messageBoxId
    }
}

export function _setFocus(messageBoxId,focusOn) {
    return {
        type: MessageBoxActionsTypes.SET_FOCUS,
        messageBoxId,
        focusOn
    }
}

export function openExpanded() {
    return {
        type: MessageBoxActionsTypes.OPEN_EXPANDED        
    }
}

export function closeExpanded() {
    return {
        type: MessageBoxActionsTypes.CLOSE_EXPANDED        
    }
}

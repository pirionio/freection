import MessageBoxActionsTypes from '../types/message-box-action-types'
import {ActionStatus} from '../../constants'
import * as ResourceUtil from '../../util/resource-util'

export function _newMessageBox(messageType,context) {
    return {
        type: MessageBoxActionsTypes.NEW_MESSAGE_BOX,
        messageType,
        context
    }
}

export function _selectMessageBox(currentMessageBoxId,selectedMessageBoxId,currentMessage) {
    return {
        type: MessageBoxActionsTypes.SELECT_MESSAGE_BOX,
        currentMessageBoxId,
        selectedMessageBoxId,
        currentMessage
    }
}

export function _messageSent(messageBoxId,shouldCloseMessageBox) {
    return {
        type: MessageBoxActionsTypes.MESSAGE_SENT,
        messageBoxId,
        shouldCloseMessageBox
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

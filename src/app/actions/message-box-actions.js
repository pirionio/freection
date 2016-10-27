import {actions} from 'react-redux-form'
import find from 'lodash/find'
import last from 'lodash/last'

import MessageBoxActionsTypes from'./types/message-box-action-types'
import {_newMessageBox, _selectMessageBox, _closeMessageBox, _setFocus} from './generated/message-box-actions'
import {GeneralConstants, ActionStatus} from'../constants'

export function newMessageBox(messageType, context, sendAction, title) {
    return (dispatch, getState) => {
        dispatch(_newMessageBox(messageType, context, sendAction, title))
        const {messagePanel} = getState()
        const previousMessageBox = getActiveMessageBox(messagePanel)
        const newMessageBox = last(messagePanel.messageBoxes)
        if (newMessageBox)
            dispatch(selectMessageBox(previousMessageBox, newMessageBox))
    }
}

export function selectMessageBox(currentMessageBox, selectedMessageBox) {
    return (dispatch, getState) => {
        const {messageBox} = getState()
        dispatch(_selectMessageBox(currentMessageBox.id, selectedMessageBox.id, messageBox.message, messageBox.editorState))
        dispatch(actions.change('messageBox', selectedMessageBox))
    }
}

export function closeMessageBox(messageBoxId) {
    return (dispatch, getState) => {
        dispatch(_closeMessageBox(messageBoxId))

        // It might be that the closed message box that had been closed was the active one.
        // In this case, we have to let the message box state know that a different box is now active instead.
        const {messagePanel} = getState()
        if (messagePanel.activeMessageBoxId !== messageBoxId) {
            dispatch(actions.change('messageBox', getActiveMessageBox(messagePanel)))
        }
    }
}

export function messageSent(messageBoxId, messagePromise) {
    return (dispatch, getState) => {
        // Use a timeout to create a delay in the consequences of the message send action.
        // We don't want to anything to happen if the result of the message returns very quickly (resulting in a COMPLETE event).
        const ongoingActionTimeout = setTimeout(() => {
            dispatch(messageSentRequest(messageBoxId))
        }, GeneralConstants.ONGOING_ACTION_DELAY_MILLIS)

        messagePromise && messagePromise.then && messagePromise.then(() => {
            const {messagePanel} = getState()

            clearTimeout(ongoingActionTimeout)

            dispatch(messageSentComplete(messageBoxId))
            dispatch(actions.change('messageBox', getActiveMessageBox(messagePanel)))
        })
    }
}

function messageSentRequest(messageBoxId) {
    return {
        type: MessageBoxActionsTypes.MESSAGE_SENT,
        status: ActionStatus.START,
        messageBoxId
    }
}

function messageSentComplete(messageBoxId) {
    return {
        type: MessageBoxActionsTypes.MESSAGE_SENT,
        status: ActionStatus.COMPLETE,
        messageBoxId
    }
}

export function setFocus(messageBoxId, focusOn) {
    return dispatch => {
        dispatch(_setFocus(messageBoxId, focusOn))
        dispatch(actions.change('messageBox.focusOn', focusOn))
    }
}

function getActiveMessageBox(messagePanel) {
    return find(messagePanel.messageBoxes, {id: messagePanel.activeMessageBoxId}) || {}
}

export * from './generated/message-box-actions'
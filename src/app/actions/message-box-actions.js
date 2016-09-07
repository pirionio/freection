const {actions} = require('react-redux-form')
const find = require('lodash/find')
const last = require('lodash/last')
const isEmpty = require('lodash/isEmpty')
const isNil = require('lodash/isNil')
const findIndex = require('lodash/findIndex')
const nth = require('lodash/nth')

import MessageBoxActionsTypes from'./types/message-box-action-types'
import {_newMessageBox, _selectMessageBox, _closeMessageBox, _setFocus } from './generated/message-box-actions'
const {GeneralConstants, ActionStatus} = require('../constants')

export function newMessageBox(messageType, context) {
    return (dispatch, getState) => {
        dispatch(_newMessageBox(messageType, context))
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
        dispatch(_selectMessageBox(currentMessageBox.id, selectedMessageBox.id, messageBox.message))
        dispatch(actions.change('messageBox', selectedMessageBox))
    }
}

export function closeMessageBox(messageBoxId) {
    return (dispatch, getState) => {
        const {messagePanel} = getState()

        // We need to select the new active message box, only if the closed one if the currently active one.
        // First try to set the active one to the next one, if none exists (since the user closed the last message box),
        // set the previous one as the active, and as last resort set none as the active.
        if (messagePanel.activeMessageBoxId === messageBoxId) {
            const messageBoxIndex = findIndex(messagePanel.messageBoxes, {id: messageBoxId})
            const next = messageBoxIndex + 1 < messagePanel.messageBoxes.length ? messagePanel.messageBoxes[messageBoxIndex + 1] : null
            const prev = messageBoxIndex - 1 >= 0 ? messagePanel.messageBoxes[messageBoxIndex - 1] : null
            const newActiveMessageBox = next || prev || {}
            dispatch(selectMessageBox(messageBoxId, newActiveMessageBox))
        }

        dispatch(_closeMessageBox(messageBoxId))
    }
}

export function messageSent(messageBoxId, shouldCloseMessageBox, messagePromise) {
    return (dispatch, getState) => {
        // Use a timeout to create a delay in the consequences of the message send action.
        // We don't want to anything to happen if the result of the message returns very quickly (resulting in a COMPLETE event).
        const ongoingActionTimeout = setTimeout(() => {
            dispatch(messageSentRequest(messageBoxId))
        }, GeneralConstants.ONGOING_ACTION_DELAY_MILLIS)

        messagePromise && messagePromise.then && messagePromise.then(() => {
            clearTimeout(ongoingActionTimeout)
            dispatch(actions.reset('messageBox'))
            dispatch(messageSentComplete(messageBoxId, shouldCloseMessageBox))

            if (shouldCloseMessageBox) {
                const {messagePanel} = getState()
                dispatch(actions.change('messageBox', getActiveMessageBox(messagePanel)))
            }
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

function messageSentComplete(messageBoxId, shouldCloseMessageBox) {
    return {
        type: MessageBoxActionsTypes.MESSAGE_SENT,
        status: ActionStatus.COMPLETE,
        messageBoxId,
        shouldCloseMessageBox
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
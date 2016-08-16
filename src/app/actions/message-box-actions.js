const {actions} = require('react-redux-form')
const last = require('lodash/last')
const isEmpty = require('lodash/isEmpty')
const findIndex = require('lodash/findIndex')
const nth = require('lodash/nth')

const MessageBoxActionsTypes = require('./types/message-box-action-types')
const MessageBoxActions = require('./generated/message-box-actions')
const {GeneralConstants, ActionStatus} = require('../constants')

const newMessageBoxAction = MessageBoxActions.newMessageBox
const selectMessageBoxAction = MessageBoxActions.selectMessageBox
const closeMessageBoxAction = MessageBoxActions.closeMessageBox
const setFocusAction = MessageBoxActions.setFocus

function newMessageBox(messageType, context) {
    return (dispatch, getState) => {
        dispatch(newMessageBoxAction(messageType, context))
        const {messagePanel} = getState()
        const previousMessageBox = messagePanel.activeMessageBox
        const newMessageBox = last(messagePanel.messageBoxes)
        if (newMessageBox)
            dispatch(selectMessageBox(previousMessageBox, newMessageBox))
    }
}

function selectMessageBox(currentMessageBox, selectedMessageBox) {
    return (dispatch, getState) => {
        const {messageBox} = getState()
        dispatch(selectMessageBoxAction(currentMessageBox, selectedMessageBox, messageBox.message))
        dispatch(actions.change('messageBox', selectedMessageBox))
    }
}

function closeMessageBox(messageBox) {
    return (dispatch, getState) => {
        const {messagePanel} = getState()

        // We need to select the new active message box, only if the closed one if the currently active one.
        // First try to set the active one to the next one, if none exists (since the user closed the last message box),
        // set the previous one as the active, and as last resort set none as the active.
        if (messagePanel.activeMessageBox.id === messageBox.id) {
            const messageBoxIndex = findIndex(messagePanel.messageBoxes, {id: messageBox.id})
            const next = messageBoxIndex + 1 < messagePanel.messageBoxes.length ? messagePanel.messageBoxes[messageBoxIndex + 1] : null
            const prev = messageBoxIndex - 1 >= 0 ? messagePanel.messageBoxes[messageBoxIndex - 1] : null
            const newActiveMessageBox = next || prev || {}
            dispatch(selectMessageBox(messageBox, newActiveMessageBox))
        }

        dispatch(closeMessageBoxAction(messageBox))
    }
}

function messageSent(messageBox, shouldCloseMessageBox, messagePromise) {
    return (dispatch, getState) => {
        // Use a timeout to create a delay in the consequences of the message send action.
        // We don't want to anything to happen if the result of the message returns very quickly (resulting in a COMPLETE event).
        const ongoingActionTimeout = setTimeout(() => {
            dispatch(messageSentRequest(messageBox))
        }, GeneralConstants.ONGOING_ACTION_DELAY_MILLIS)

        dispatch(actions.submit('messageBox', messagePromise)).then(() => {
            clearTimeout(ongoingActionTimeout)
            dispatch(messageSentComplete(messageBox, shouldCloseMessageBox))

            const {messagePanel} = getState()
            if (isEmpty(messagePanel.activeMessageBox))
                dispatch(actions.reset('messageBox'))
            else
                dispatch(actions.change('messageBox', messagePanel.activeMessageBox))
        })
    }
}

function messageSentRequest(messageBox) {
    return {
        type: MessageBoxActionsTypes.MESSAGE_SENT,
        status: ActionStatus.START,
        messageBox
    }
}

function messageSentComplete(messageBox, shouldCloseMessageBox) {
    return {
        type: MessageBoxActionsTypes.MESSAGE_SENT,
        status: ActionStatus.COMPLETE,
        messageBox,
        shouldCloseMessageBox
    }
}

function setFocus(messageBox, focusOn) {
    return dispatch => {
        dispatch(setFocusAction(messageBox, focusOn))
        dispatch(actions.change('messageBox.focusOn', focusOn))
    }
}

module.exports = MessageBoxActions
module.exports.newMessageBox = newMessageBox
module.exports.selectMessageBox = selectMessageBox
module.exports.messageSent = messageSent
module.exports.closeMessageBox = closeMessageBox
module.exports.setFocus = setFocus

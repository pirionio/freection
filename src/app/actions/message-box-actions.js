const {actions} = require('react-redux-form')
const last = require('lodash/last')
const isEmpty = require('lodash/isEmpty')

const MessageBoxActionsTypes = require('./types/message-box-action-types')
const MessageBoxActions = require('./generated/message-box-actions')
const {GeneralConstants, ActionStatus} = require('../constants')

const newMessageAction = MessageBoxActions.newMessage
const selectMessageBoxAction = MessageBoxActions.selectMessageBox

function newMessage(messageType, context) {
    return (dispatch, getState) => {
        dispatch(newMessageAction(messageType, context))
        const {newMessagePanel} = getState()
        const previousMessageBox = newMessagePanel.activeMessageBox
        const newMessageBox = last(newMessagePanel.messageBoxes)
        dispatch(selectMessageBox(previousMessageBox, newMessageBox))
    }
}

function selectMessageBox(currentMessageBox, selectedMessageBox) {
    return (dispatch, getState) => {
        const {newMessageBox} = getState()
        dispatch(selectMessageBoxAction(currentMessageBox, selectedMessageBox, newMessageBox.message))
        dispatch(actions.change('newMessageBox.message', selectedMessageBox.message))
    }
}

function messageSent(messageBox, shouldCloseMessageBox, messagePromise) {
    return (dispatch, getState) => {
        // Use a timeout to create a delay in the consequences of the message send action.
        // We don't want to anything to happen if the result of the message returns very quickly (resulting in a COMPLETE event).
        const ongoingActionTimeout = setTimeout(() => {
            dispatch(messageSentRequest(messageBox))
        }, GeneralConstants.ONGOING_ACTION_DELAY_MILLIS)

        dispatch(actions.submit('newMessageBox', messagePromise)).then(() => {
            clearTimeout(ongoingActionTimeout)
            dispatch(messageSentComplete(messageBox, shouldCloseMessageBox))

            const {newMessagePanel} = getState()
            if (isEmpty(newMessagePanel.activeMessageBox))
                dispatch(actions.reset('newMessageBox'))
            else
                dispatch(actions.change('newMessageBox.message', newMessagePanel.activeMessageBox.message))
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

module.exports = MessageBoxActions
module.exports.newMessage = newMessage
module.exports.selectMessageBox = selectMessageBox
module.exports.messageSent = messageSent

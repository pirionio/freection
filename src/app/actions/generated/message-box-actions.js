const MessageBoxActionsTypes = require('../types/message-box-action-types')
const {ActionStatus} = require('../../constants')
const ResourceUtil = require('../../util/resource-util')

function newMessageBox(messageType,context) {
    return {
        type: MessageBoxActionsTypes.NEW_MESSAGE_BOX,
        messageType,
        context
    }
}

function selectMessageBox(currentMessageBoxId,selectedMessageBoxId,currentMessage) {
    return {
        type: MessageBoxActionsTypes.SELECT_MESSAGE_BOX,
        currentMessageBoxId,
        selectedMessageBoxId,
        currentMessage
    }
}


function closeMessageBox(messageBoxId) {
    return {
        type: MessageBoxActionsTypes.CLOSE_MESSAGE_BOX,
        messageBoxId
    }
}

function setFocus(messageBoxId,focusOn) {
    return {
        type: MessageBoxActionsTypes.SET_FOCUS,
        messageBoxId,
        focusOn
    }
}

module.exports = {
    newMessageBox,
    selectMessageBox,
    closeMessageBox,
    setFocus
}
const MessageBoxActionsTypes = require('../types/message-box-action-types')
const {ActionStatus} = require('../../constants')
const ResourceUtil = require('../../util/resource-util')

function newMessage(messageType,context) {
    return {
        type: MessageBoxActionsTypes.NEW_MESSAGE,
        messageType,
        context
    }
}

function selectMessageBox(currentMessageBox,selectedMessageBox,currentMessage) {
    return {
        type: MessageBoxActionsTypes.SELECT_MESSAGE_BOX,
        currentMessageBox,
        selectedMessageBox,
        currentMessage
    }
}


function closeMessageBox(messageBox) {
    return {
        type: MessageBoxActionsTypes.CLOSE_MESSAGE_BOX,
        messageBox
    }
}

module.exports = {
    newMessage,
    selectMessageBox,
    closeMessageBox
}
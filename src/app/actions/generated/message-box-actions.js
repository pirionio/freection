const MessageBoxActionsTypes = require('../types/message-box-action-types')
const {ActionStatus} = require('../../constants')
const ResourceUtil = require('../../util/resource-util')

function selectOption(option) {
    return {
        type: MessageBoxActionsTypes.SELECT_OPTION,
        option
    }
}

module.exports = {
    selectOption
}
import InlineMessageActionsTypes from '../types/inline-message-action-types'
import {ActionStatus} from '../../constants'
import * as ResourceUtil from '../../util/resource-util'

export function show(action) {
    return {
        type: InlineMessageActionsTypes.SHOW,
        action
    }
}

export function close() {
    return {
        type: InlineMessageActionsTypes.CLOSE        
    }
}

export function messageSent(messageText) {
    return {
        type: InlineMessageActionsTypes.MESSAGE_SENT,
        messageText
    }
}

const uniqueId = require('lodash/uniqueId')
const find = require('lodash/find')
const head = require('lodash/head')

const MessageBoxActionTypes = require('../actions/types/message-box-action-types')
const ThingPageActionTypes = require('../actions/types/thing-page-action-types')
const immutable = require('../util/immutable')
const {ActionStatus} = require('../constants')
const MessageTypes = require('../../common/enums/message-types')

const defaultMessageBox = {
    id: uniqueId(),
    ongoingAction: false,
    type: MessageTypes.NEW_THING,
    title: MessageTypes.NEW_THING.label,
    message: {}
}

const initialState = {
    messageBoxes: [],
    activeMessageBox: {}
}

function createDefaultMessageBox(state) {
    if (state.messageBoxes.length)
        return state

    return immutable(state)
        .arrayPushItem('messageBoxes', defaultMessageBox)
        .value()
}

function newMessage(state, action) {
    const messageBox = {
        id: uniqueId(),
        type: action.messageType,
        title: action.context ? action.context.subject : action.messageType.label,
        context: action.context,
        ongoingAction: false
    }

    return immutable(state)
        .arrayPushItem('messageBoxes', messageBox)
        .value()
}

function newMessageInContext(state, action) {
    switch (action.status) {
        case ActionStatus.COMPLETE:
            const existingMessageBox = find(state.messageBoxes, {context: {id: action.thing.id}})
            if (!existingMessageBox) {
                const messageBox = {
                    id: uniqueId(),
                    type: MessageTypes.NEW_COMMENT,
                    title: action.thing.subject,
                    context: action.thing,
                    ongoingAction: false
                }
                return immutable(state)
                    .arrayPushItem('messageBoxes', messageBox)
                    .set('activeMessageBox', messageBox)
                    .value()
            }
        default:
            return state
    }
}

function closeMessageBox(state, action) {
    const newState = immutable(state)
        .arrayReject('messageBoxes', {id: action.messageBox.id})
        .value()

    return immutable(newState)
        .set('activeMessageBox', head(newState.messageBoxes) || {})
        .value()
}

function selectMessageBox(state, action) {
    return immutable(state)
        .arrayMergeItem('messageBoxes', {id: action.currentMessageBox.id}, {message: action.currentMessage})
        .set('activeMessageBox', action.selectedMessageBox)
        .value()
}

function messageSent(state, action) {
    switch (action.status) {
        case ActionStatus.START:
            return immutable(state)
                .arrayMergeItem('messageBoxes', {id: action.messageBox.id}, {ongoingAction: true})
                .value()
        case ActionStatus.COMPLETE:
            if (!action.shouldCloseMessageBox)
                return state
            
            return immutable(state)
                .arrayReject('messageBoxes', {id: action.messageBox.id})
                .set('activeMessageBox', state.messageBoxes.length > 1 ? state.messageBoxes[1] : {})
                .value()
        default:
            return state
    }
}

module.exports = (state = initialState, action) => {
    switch (action.type) {
        case MessageBoxActionTypes.NEW_MESSAGE:
            return newMessage(state, action)
        case MessageBoxActionTypes.CLOSE_MESSAGE_BOX:
            return closeMessageBox(state, action)
        case MessageBoxActionTypes.SELECT_MESSAGE_BOX:
            return selectMessageBox(state, action)
        case MessageBoxActionTypes.MESSAGE_SENT:
            return messageSent(state, action)
        case ThingPageActionTypes.GET:
            return newMessageInContext(state, action)
        default:
            return state
            // return createDefaultMessageBox(state)
    }
}
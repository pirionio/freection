const uniqueId = require('lodash/uniqueId')
const find = require('lodash/find')
const head = require('lodash/head')

const MessageBoxActionTypes = require('../actions/types/message-box-action-types')
const ThingPageActionTypes = require('../actions/types/thing-page-action-types')
const EmailPageActionTypes = require('../actions/types/email-page-action-types')
const immutable = require('../util/immutable')
const {ActionStatus} = require('../constants')
const MessageTypes = require('../../common/enums/message-types')

const initialState = {
    messageBoxes: [],
    activeMessageBox: {}
}

function newMessageBox(state, action) {
    // This is sad, but when there's a new message box for reply to email, we don't have the full object of the email's thread,
    // so we can't really add the new message box, with the right context.
    // We'd have to wait for a GET on the whole thread to occur, and only then create the message box.
    if (action.messageType.key === MessageTypes.REPLY_EMAIL.key)
        return state
    
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

function newMessageInThing(state, action) {
    return newMessageInContext(state, action, MessageTypes.COMMENT_THING, 'thing')
}

function newMessageInEmail(state, action) {
    return newMessageInContext(state, action, MessageTypes.REPLY_EMAIL, 'thread')
}

function newMessageInContext(state, action, type, contextField) {
    switch (action.status) {
        case ActionStatus.COMPLETE:
            const existingMessageBox = find(state.messageBoxes, {context: {id: action[contextField].id}})
            if (existingMessageBox)
                return immutable(state)
                    .arrayMergeItem('messageBoxes', {id: existingMessageBox.id}, {context: action[contextField]})
                    .merge('activeMessageBox', {context: action[contextField]})
                    .value()

            const messageBox = {
                id: uniqueId(),
                type,
                title: action[contextField].subject,
                context: action[contextField],
                ongoingAction: false
            }
            return immutable(state)
                .arrayPushItem('messageBoxes', messageBox)
                .set('activeMessageBox', messageBox)
                .value()
        default:
            return state
    }
}

function closeMessageBox(state, action) {
    return immutable(state)
        .arrayReject('messageBoxes', {id: action.messageBox.id})
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
        case MessageBoxActionTypes.NEW_MESSAGE_BOX:
            return newMessageBox(state, action)
        case MessageBoxActionTypes.CLOSE_MESSAGE_BOX:
            return closeMessageBox(state, action)
        case MessageBoxActionTypes.SELECT_MESSAGE_BOX:
            return selectMessageBox(state, action)
        case MessageBoxActionTypes.MESSAGE_SENT:
            return messageSent(state, action)
        case ThingPageActionTypes.GET_THING:
            return newMessageInThing(state, action)
        case EmailPageActionTypes.GET_EMAIL:
            return newMessageInEmail(state, action)
        default:
            return state
    }
}
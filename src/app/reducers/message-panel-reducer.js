import uniqueId from 'lodash/uniqueId'
import findIndex from 'lodash/findIndex'

import MessageBoxActionTypes from '../actions/types/message-box-action-types'
import immutable from '../util/immutable'
import {GeneralConstants, ActionStatus} from '../constants'

const initialState = {
    messageBoxes: [],
    activeMessageBoxId: null
}

function newMessageBox(state, action) {
    if (state.messageBoxes.length >= GeneralConstants.MAX_MESSAGE_PANEL_TABS)
        return state
    
    const messageBox = {
        id: uniqueId(),
        type: action.messageType,
        title: getMessageBoxTitle(action),
        context: action.context,
        ongoingAction: false,
        editorState: null,
        action: action.sendAction
    }

    return immutable(state)
        .arrayPushItem('messageBoxes', messageBox)
        .value()
}

function getMessageBoxTitle(action) {
    if (action.title)
        return action.title

    if (action.context)
        return action.context.subject

    return action.messageType.label
}

function closeMessageBox(state, action) {
    return immutable(state)
        .arrayReject('messageBoxes', {id: action.messageBoxId})
        .set('activeMessageBoxId', determineActive(state, action.messageBoxId))
        .value()
}

function selectMessageBox(state, action) {
    return immutable(state)
        .arrayMergeItem('messageBoxes', {id: action.currentMessageBoxId}, {message: action.currentMessage, editorState: action.editorState})
        .set('activeMessageBoxId', action.selectedMessageBoxId)
        .value()
}

function messageSent(state, action) {
    switch (action.status) {
        case ActionStatus.START:
            return immutable(state)
                .arrayMergeItem('messageBoxes', {id: action.messageBoxId}, {ongoingAction: true})
                .value()
        case ActionStatus.COMPLETE:
            return immutable(state)
                .arrayReject('messageBoxes', {id: action.messageBoxId})
                .set('activeMessageBoxId', determineActive(state, action.messageBoxId))
                .value()
        default:
            return state
    }
}

function setFocus(state, action) {
    return immutable(state)
        .arrayMergeItem('messageBoxes', {id: action.messageBoxId}, {focusOn: action.focusOn})
        .value()
}

function determineActive(state, messageBoxId) {
    if (messageBoxId !== state.activeMessageBoxId)
        return state.activeMessageBoxId

    const activeIndex = findIndex(state.messageBoxes, {id: state.activeMessageBoxId})
    const next = activeIndex + 1 < state.messageBoxes.length ? state.messageBoxes[activeIndex + 1] : null
    const prev = activeIndex - 1 >= 0 ? state.messageBoxes[activeIndex - 1] : null
    if (next)
        return next.id
    if (prev)
        return prev.id
    return null
}

export default (state = initialState, action) => {
    switch (action.type) {
        case MessageBoxActionTypes.NEW_MESSAGE_BOX:
            return newMessageBox(state, action)
        case MessageBoxActionTypes.CLOSE_MESSAGE_BOX:
            return closeMessageBox(state, action)
        case MessageBoxActionTypes.SELECT_MESSAGE_BOX:
            return selectMessageBox(state, action)
        case MessageBoxActionTypes.MESSAGE_SENT:
            return messageSent(state, action)
        case MessageBoxActionTypes.SET_FOCUS:
            return setFocus(state, action)
        default:
            return state
    }
}
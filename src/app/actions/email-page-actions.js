const {push} = require('react-router-redux')
const find = require('lodash/find')

import {_getEmail, _showEmailPage, _hideEmailPage} from './generated/email-page-actions'
import * as MessageBoxActions from './message-box-actions'
const {InvalidationStatus} = require('../constants')
import MessageTypes from '../../common/enums/message-types'

export function getEmail(threadId) {
    return (dispatch, getState) => {
        const {emailPage} = getState()
        if (emailPage.invalidationStatus === InvalidationStatus.INVALIDATED ||
            emailPage.invalidationStatus === InvalidationStatus.REQUIRE_UPDATE) {
            return dispatch(_getEmail(threadId))
        }
    }
}

export function showEmailPage(email) {
    return dispatch => {
        dispatch(push(`${window.location.pathname}/${email.payload.threadId}`))
        dispatch(_showEmailPage(email))
        dispatch(MessageBoxActions.newMessageBox(MessageTypes.REPLY_EMAIL, email))
    }
}

export function hideEmailPage() {
    return (dispatch, getState) => {
        const {emailPage, messagePanel} = getState()
        const threadId = emailPage.thread.id

        dispatch(_hideEmailPage())

        const messageBox = find(messagePanel.messageBoxes, {context: {id: threadId}})
        messageBox && dispatch(MessageBoxActions.closeMessageBox(messageBox.id))
    }
}

export * from './generated/email-page-actions'
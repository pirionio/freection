const {push} = require('react-router-redux')
const find = require('lodash/find')

const EmailPageActions = require('./generated/email-page-actions')
const MessageBoxActions = require('./message-box-actions')
const {InvalidationStatus} = require('../constants')
const MessageTypes = require('../../common/enums/message-types')

const getAction = EmailPageActions.getEmail
const showAction = EmailPageActions.showEmailPage
const hideAction = EmailPageActions.hideEmailPage

function getEmail(threadId) {
    return (dispatch, getState) => {
        const {emailPage} = getState()
        if (emailPage.invalidationStatus === InvalidationStatus.INVALIDATED) {
            return dispatch(getAction(threadId))
        }
    }
}

function showEmailPage(email) {
    return dispatch => {
        dispatch(push(`/emails/${email.payload.threadId}`))
        dispatch(showAction(email.payload.threadId))
        dispatch(MessageBoxActions.newMessageBox(MessageTypes.REPLY_EMAIL, email))
    }
}

function hideEmailPage() {
    return (dispatch, getState) => {
        const {emailPage, newMessagePanel} = getState()
        const threadId = emailPage.thread.id

        dispatch(hideAction())

        const messageBox = find(newMessagePanel.messageBoxes, {context: {id: threadId}})
        messageBox && dispatch(MessageBoxActions.closeMessageBox(messageBox))
    }
}

module.exports = EmailPageActions
EmailPageActions.getEmail = getEmail
EmailPageActions.showEmailPage = showEmailPage
EmailPageActions.hideEmailPage = hideEmailPage
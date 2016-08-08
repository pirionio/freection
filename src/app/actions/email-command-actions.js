const EmailCommandActions = require('./generated/email-command-actions')
const MessageBoxActions = require('./message-box-actions')

const newEmailAction = EmailCommandActions.newEmail
const replyToAllAction = EmailCommandActions.replyToAll

function newEmail(email) {
    return dispatch => {
        const promise = dispatch(newEmailAction(email))
        MessageBoxActions.newMessage(dispatch, promise, 'newMessageBox')
    }
}

function replyToAll(threadId, messageText, subject, to, inReplyTo) {
    return dispatch => {
        const promise = dispatch(replyToAllAction(threadId, messageText, subject, to, inReplyTo))
        MessageBoxActions.newMessage(dispatch, promise, 'replyEmailBox')
    }
}

module.exports = EmailCommandActions
module.exports.newEmail = newEmail
module.exports.replyToAll = replyToAll
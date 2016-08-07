const EmailCommandActions = require('./generated/email-command-actions')
const MessageBoxActions = require('./message-box-actions')

const newEmailAction = EmailCommandActions.newEmail

function newEmail(email) {
    return dispatch => {
        const promise = dispatch(newEmailAction(email))
        MessageBoxActions.newMessage(dispatch, promise, 'newMessageBox')
    }
}

module.exports = EmailCommandActions
module.exports.newEmail = newEmail
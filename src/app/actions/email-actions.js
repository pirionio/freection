const EmailActions = require('./generated/email-actions')
const {InvalidationStatus} = require('../constants')

const fetchUnreadActions = EmailActions.fetchUnread

function fetchUnread() {
    return (dispatch, getState) => {
        const {unreadEmails} = getState()
        if (unreadEmails.invalidationStatus === InvalidationStatus.INVALIDATED) {
            dispatch(fetchUnreadActions())
        }
    }
}

module.exports = EmailActions
module.exports.fetchUnread = fetchUnread
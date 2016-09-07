import {_fetchUnread} from './generated/email-actions'

const {InvalidationStatus} = require('../constants')

export function fetchUnread() {
    return (dispatch, getState) => {
        const {unreadEmails} = getState()
        if (unreadEmails.invalidationStatus === InvalidationStatus.INVALIDATED) {
            dispatch(_fetchUnread())
        }
    }
}


export * from './generated/email-actions'
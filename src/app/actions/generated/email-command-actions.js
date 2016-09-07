import EmailCommandActionsTypes from '../types/email-command-action-types'
import {ActionStatus} from '../../constants'
import ResourceUtil from '../../util/resource-util'

export function newEmail(email) {
    return dispatch => {
        dispatch({
            type: EmailCommandActionsTypes.NEW_EMAIL, 
            status: ActionStatus.START,
            email
        })
        return ResourceUtil.post(`/api/new/email`, {
                to: email.to,
                body: email.body,
                subject: email.subject
            })
            .then(result => dispatch({
                type: EmailCommandActionsTypes.NEW_EMAIL, 
                status: ActionStatus.COMPLETE,
                email
            }))
            .catch(() => dispatch({
                type: EmailCommandActionsTypes.NEW_EMAIL, 
                status: ActionStatus.ERROR,
                email
            }))
    }
}

export function doEmail(threadId) {
    return dispatch => {
        dispatch({
            type: EmailCommandActionsTypes.DO_EMAIL, 
            status: ActionStatus.START,
            threadId
        })
        return ResourceUtil.post(`/emails/api/${threadId}/do`)
            .then(result => dispatch({
                type: EmailCommandActionsTypes.DO_EMAIL, 
                status: ActionStatus.COMPLETE,
                threadId
            }))
            .catch(() => dispatch({
                type: EmailCommandActionsTypes.DO_EMAIL, 
                status: ActionStatus.ERROR,
                threadId
            }))
    }
}

export function replyToAll(threadId, messageText, subject, to, inReplyTo, references) {
    return dispatch => {
        dispatch({
            type: EmailCommandActionsTypes.REPLY_TO_ALL, 
            status: ActionStatus.START,
            threadId,
            messageText,
            subject,
            to,
            inReplyTo,
            references
        })
        return ResourceUtil.post(`/emails/api/message`, {
                messageText: messageText,
                subject: subject,
                to: to,
                inReplyTo: inReplyTo,
                references: references
            })
            .then(result => dispatch({
                type: EmailCommandActionsTypes.REPLY_TO_ALL, 
                status: ActionStatus.COMPLETE,
                threadId: threadId,
                message: result
            }))
            .catch(() => dispatch({
                type: EmailCommandActionsTypes.REPLY_TO_ALL, 
                status: ActionStatus.ERROR,
                threadId,
                messageText,
                subject,
                to,
                inReplyTo,
                references
            }))
    }
}

export function markAsRead(emailUids) {
    return dispatch => {
        dispatch({
            type: EmailCommandActionsTypes.MARK_AS_READ, 
            status: ActionStatus.START,
            emailUids
        })
        return ResourceUtil.post(`/emails/api/markasread`, {
                emailUids: emailUids
            })
            .then(result => dispatch({
                type: EmailCommandActionsTypes.MARK_AS_READ, 
                status: ActionStatus.COMPLETE,
                emailUids: emailUids
            }))
            .catch(() => dispatch({
                type: EmailCommandActionsTypes.MARK_AS_READ, 
                status: ActionStatus.ERROR,
                emailUids
            }))
    }
}

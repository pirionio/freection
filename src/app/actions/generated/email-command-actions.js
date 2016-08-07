const EmailCommandActionsTypes = require('../types/email-command-action-types')
const {ActionStatus} = require('../../constants')
const ResourceUtil = require('../../util/resource-util')

function newEmail(email) {
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

function doEmail(threadId) {
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

function markAsRead(emailIds) {
    return dispatch => {
        dispatch({
            type: EmailCommandActionsTypes.MARK_AS_READ, 
            status: ActionStatus.START,
            emailIds
        })
        return ResourceUtil.post(`/emails/api/markasread`, {
                emailIds: emailIds
            })
            .then(result => dispatch({
                type: EmailCommandActionsTypes.MARK_AS_READ, 
                status: ActionStatus.COMPLETE,
                emailIds: emailIds
            }))
            .catch(() => dispatch({
                type: EmailCommandActionsTypes.MARK_AS_READ, 
                status: ActionStatus.ERROR,
                emailIds
            }))
    }
}

module.exports = {
    newEmail,
    doEmail,
    markAsRead
}
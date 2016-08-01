const EmailCommandActionsTypes = require('../types/email-command-action-types')
const {ActionStatus} = require('../../constants')
const ResourceUtil = require('../../util/resource-util')

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
    markAsRead
}
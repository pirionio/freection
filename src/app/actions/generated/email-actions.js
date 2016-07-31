const EmailActionsTypes = require('../types/email-action-types')
const {ActionStatus} = require('../../constants')
const ResourceUtil = require('../../util/resource-util')

function fetchUnread() {
    return dispatch => {
        dispatch({
            type: EmailActionsTypes.FETCH_UNREAD, 
            status: ActionStatus.START            
        })
        return ResourceUtil.get(`/emails/api/unread`)
            .then(result => dispatch({
                type: EmailActionsTypes.FETCH_UNREAD, 
                status: ActionStatus.COMPLETE,
                emails: result
            }))
            .catch(() => dispatch({
                type: EmailActionsTypes.FETCH_UNREAD,
                status: ActionStatus.ERROR
            }))
    }
}

module.exports = {
    fetchUnread
}
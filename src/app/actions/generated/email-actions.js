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

function updateUnread() {
    return dispatch => {
        dispatch({
            type: EmailActionsTypes.UPDATE_UNREAD, 
            status: ActionStatus.START            
        })
        return ResourceUtil.get(`/emails/api/unread`)
            .then(result => dispatch({
                type: EmailActionsTypes.UPDATE_UNREAD, 
                status: ActionStatus.COMPLETE,
                emails: result
            }))
            .catch(() => dispatch({
                type: EmailActionsTypes.UPDATE_UNREAD, 
                status: ActionStatus.ERROR                
            }))
    }
}

function hello() {
    return dispatch => {
        dispatch({
            type: EmailActionsTypes.HELLO, 
            status: ActionStatus.START            
        })
        return ResourceUtil.post(`/emails/push/hello`)
            .then(result => dispatch({
                type: EmailActionsTypes.HELLO, 
                status: ActionStatus.COMPLETE                
            }))
            .catch(() => dispatch({
                type: EmailActionsTypes.HELLO, 
                status: ActionStatus.ERROR                
            }))
    }
}

function invalidate() {
    return {
        type: EmailActionsTypes.INVALIDATE        
    }
}

module.exports = {
    fetchUnread,
    updateUnread,
    hello,
    invalidate
}
const EmailPageActionsTypes = require('../types/email-page-action-types')
const {ActionStatus} = require('../../constants')
const ResourceUtil = require('../../util/resource-util')

function show(emailThreadId) {
    return {
        type: EmailPageActionsTypes.SHOW,
        emailThreadId
    }
}

function hide() {
    return {
        type: EmailPageActionsTypes.HIDE        
    }
}

function get(emailThreadId) {
    return dispatch => {
        dispatch({
            type: EmailPageActionsTypes.GET, 
            status: ActionStatus.START,
            emailThreadId
        })
        return ResourceUtil.get(`/emails/api/${emailThreadId}`)
            .then(result => dispatch({
                type: EmailPageActionsTypes.GET, 
                status: ActionStatus.COMPLETE,
                thread: result
            }))
            .catch(() => dispatch({
                type: EmailPageActionsTypes.GET,
                status: ActionStatus.ERROR,
                emailThreadId
            }))
    }
}

module.exports = {
    show,
    hide,
    get
}
const EmailPageActionsTypes = require('../types/email-page-action-types')
const {ActionStatus} = require('../../constants')
const ResourceUtil = require('../../util/resource-util')

function showEmailPage(emailThread) {
    return {
        type: EmailPageActionsTypes.SHOW_EMAIL_PAGE,
        emailThread
    }
}

function hideEmailPage() {
    return {
        type: EmailPageActionsTypes.HIDE_EMAIL_PAGE        
    }
}

function requireUpdate() {
    return {
        type: EmailPageActionsTypes.REQUIRE_UPDATE        
    }
}

function getEmail(emailThreadId) {
    return dispatch => {
        dispatch({
            type: EmailPageActionsTypes.GET_EMAIL, 
            status: ActionStatus.START,
            emailThreadId
        })
        return ResourceUtil.get(`/emails/api/${emailThreadId}`)
            .then(result => dispatch({
                type: EmailPageActionsTypes.GET_EMAIL, 
                status: ActionStatus.COMPLETE,
                thread: result
            }))
            .catch(() => dispatch({
                type: EmailPageActionsTypes.GET_EMAIL, 
                status: ActionStatus.ERROR,
                emailThreadId
            }))
    }
}

module.exports = {
    showEmailPage,
    hideEmailPage,
    requireUpdate,
    getEmail
}
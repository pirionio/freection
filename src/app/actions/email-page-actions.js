const EmailPageActions = require('./generated/email-page-actions')
const {push} = require('react-router-redux')

const showAction = EmailPageActions.show

function show(emailThreadId) {
    return dispatch => {
        dispatch(push(`/emails/${emailThreadId}`))
        dispatch(showAction(emailThreadId))
    }
}

const hideAction = EmailPageActions.hide

function hide() {
    return dispatch => {
        dispatch(hideAction())
    }
}

module.exports = EmailPageActions
EmailPageActions.show = show
EmailPageActions.hide = hide
const EmailPageActionsTypes = {
    SHOW_EMAIL_PAGE: 'EMAIL_PAGE_SHOW_EMAIL_PAGE',
    HIDE_EMAIL_PAGE: 'EMAIL_PAGE_HIDE_EMAIL_PAGE',
    REQUIRE_UPDATE: 'EMAIL_PAGE_REQUIRE_UPDATE',
    GET_EMAIL: 'EMAIL_PAGE_GET_EMAIL'
}

export default EmailPageActionsTypes

export function isOfTypeEmailPage(type) {
    switch(type) {
        case EmailPageActionsTypes.SHOW_EMAIL_PAGE:
        case EmailPageActionsTypes.HIDE_EMAIL_PAGE:
        case EmailPageActionsTypes.REQUIRE_UPDATE:
        case EmailPageActionsTypes.GET_EMAIL:
            return true
        default:
            return false
    }
}
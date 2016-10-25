const AuthActionsTypes = {
    SET_STATE: 'AUTH_SET_STATE'
}

export default AuthActionsTypes

export function isOfTypeAuth(type) {
    switch(type) {
        case AuthActionsTypes.SET_STATE:
            return true
        default:
            return false
    }
}
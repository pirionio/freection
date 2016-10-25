const UsersActionsTypes = {
    SET_STATE: 'USERS_SET_STATE'
}

export default UsersActionsTypes

export function isOfTypeUsers(type) {
    switch(type) {
        case UsersActionsTypes.SET_STATE:
            return true
        default:
            return false
    }
}
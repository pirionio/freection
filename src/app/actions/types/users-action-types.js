const UsersActionsTypes = {
    SET_STATE: 'USERS_SET_STATE',
    ADD_USER: 'USERS_ADD_USER'
}

export default UsersActionsTypes

export function isOfTypeUsers(type) {
    switch(type) {
        case UsersActionsTypes.SET_STATE:
        case UsersActionsTypes.ADD_USER:
            return true
        default:
            return false
    }
}
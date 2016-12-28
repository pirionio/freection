const UserProfileActionsTypes = {
    SET_STATE: 'USER_PROFILE_SET_STATE'
}

export default UserProfileActionsTypes

export function isOfTypeUserProfile(type) {
    switch(type) {
        case UserProfileActionsTypes.SET_STATE:
            return true
        default:
            return false
    }
}
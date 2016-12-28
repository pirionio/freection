import UserProfileActionsTypes from '../actions/types/user-profile-action-types'

const initialState = {}

export default (state = initialState, action) => {
    switch (action.type) {
        case UserProfileActionsTypes.SET_STATE:
            return action.state
        default:
            return state
    }
}

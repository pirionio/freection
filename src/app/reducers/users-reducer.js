import UsersActionTypes from '../actions/types/users-action-types'

const initialState = []

export default (state = initialState, action) => {
    if (action.type === UsersActionTypes.SET_STATE) {
        return action.users
    }

    return state
}

import some from 'lodash/some'

import UsersActionTypes from '../actions/types/users-action-types'

const initialState = []

export default (state = initialState, action) => {
    if (action.type === UsersActionTypes.SET_STATE) {
        return action.users
    }

    if (action.type === UsersActionTypes.ADD_USER && !some(state, user => user.id === action.user.id)) {
        return [...state, action.user]
    }

    return state
}

import AuthActionsTypes from '../actions/types/auth-action-types'

export default function auth(state = {}, action){
    if (action.type === AuthActionsTypes.SET_STATE)
        return action.state

    return state
}
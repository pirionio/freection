import AuthActionsTypes from '../actions/types/auth-action-types'

function auth(state = {}, action){
    if (action.type === AuthActionsTypes.SET_STATE)
        return action.state

    return state
}

module.exports = auth
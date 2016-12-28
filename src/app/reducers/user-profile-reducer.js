import {ActionStatus} from '../constants'
import UserProfileActionsTypes from '../actions/types/user-profile-action-types'
import WelcomeActionTypes from '../actions/types/welcome-action-types'
import immutable from '../util/immutable'

const initialState = {}

function setWelcomeStatus(state, action) {
    switch (action.status) {
        case ActionStatus.COMPLETE:
            return immutable(state)
                .set('welcomeStatus', action.user.payload.welcomeStatus)
                .value()
        default:
            return state
    }
}

export default (state = initialState, action) => {
    switch (action.type) {
        case UserProfileActionsTypes.SET_STATE:
            return action.state
        case WelcomeActionTypes.SET_WELCOME_STATUS:
            return setWelcomeStatus(state, action)
        default:
            return state
    }
}

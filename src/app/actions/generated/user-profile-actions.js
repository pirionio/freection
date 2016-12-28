import UserProfileActionsTypes from '../types/user-profile-action-types'
import {ActionStatus} from '../../constants'
import * as ResourceUtil from '../../util/resource-util'

export function setState(state) {
    return {
        type: UserProfileActionsTypes.SET_STATE,
        state
    }
}

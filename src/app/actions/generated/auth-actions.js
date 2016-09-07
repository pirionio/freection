import AuthActionsTypes from '../types/auth-action-types'
import {ActionStatus} from '../../constants'
import ResourceUtil from '../../util/resource-util'

export function setState(state) {
    return {
        type: AuthActionsTypes.SET_STATE,
        state
    }
}

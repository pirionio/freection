import UsersActionsTypes from '../types/users-action-types'
import {ActionStatus} from '../../constants'
import * as ResourceUtil from '../../util/resource-util'

export function setState(users) {
    return {
        type: UsersActionsTypes.SET_STATE,
        users
    }
}

import UsersActionsTypes from '../types/users-action-types'
import {ActionStatus} from '../../constants'
import * as ResourceUtil from '../../util/resource-util'

export function setState(users) {
    return {
        type: UsersActionsTypes.SET_STATE,
        users
    }
}

export function addUser(user) {
    return {
        type: UsersActionsTypes.ADD_USER,
        user
    }
}

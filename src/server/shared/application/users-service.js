import {reject} from 'lodash'

import {User} from '../models'
import {userToAddress} from './address-creator'

export async function findUsers(user, query) {
    const organizationsUsers = await User.getOrganizationUsers(user.organization)

    const users = organizationsUsers.map(userToAddress)

    return users.filter(user => user.displayName.toLowerCase().includes(query) || user.payload.email.toLowerCase().includes(query))
}

export async function getUsers(user) {
    const organizationsUsers = await User.getOrganizationUsers(user.organization)

    return organizationsUsers.map(userToAddress)
}

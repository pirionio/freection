import {reject} from 'lodash'

import {User} from '../models'
import {userToAddress} from './address-creator'

export async function get(user, query) {
    const organizationsUsers = await User.getOrganizationUsers(user.organization)

    const users = organizationsUsers.map(userToAddress)

    return users.filter(user => user.displayName.toLowerCase().includes(query) || user.payload.email.toLowerCase().includes(query))
}

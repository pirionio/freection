import {reject} from 'lodash'
import {User} from '../models'
import {userToAddress} from './address-creator'

export async function get(user) {
    const organizationsUsers = await User.getOrganizationUsers(user.organization)
    const withoutMe = reject(organizationsUsers, orgUser => orgUser.id === user.id)

    return withoutMe.map(userToAddress)
}

module.exports = {get}

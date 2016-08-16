const {reject} = require('lodash')
const {User} = require('../models')
const {userToAddress} = require('./address-creator')

async function get(user) {
    const organizationsUsers = await User.getOrganizationUsers(user.organization)
    const withoutMe = reject(organizationsUsers, orgUser => orgUser.id === user.id)

    return withoutMe.map(userToAddress)
}

module.exports = {get}

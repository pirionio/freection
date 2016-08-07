const UserTypes = require('../../../common/enums/user-types')

function userToAddress(user) {
    return {
        id: user.id,
        type: UserTypes.FREECTION.key,
        displayName: `${user.firstName} ${user.lastName}`,
        payload: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        }
    }
}

module.exports = {userToAddress}

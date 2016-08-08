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

function emailToAddress(email, name) {
    return {
        id: email,
        type: UserTypes.EMAIL.key,
        payload: {
            email: email
        },
        displayName: name ? name : `<${email}>`
    }
}

module.exports = {userToAddress, emailToAddress}

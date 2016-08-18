const AddressParser = require('email-addresses')

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
    const address = AddressParser.parseOneAddress(email)

    let displayName

    if (name)
        displayName = name
    else if (address.name)
        displayName = address.name
    else
        displayName = `<${address.address}>`

    return {
        id: email,
        type: UserTypes.EMAIL.key,
        payload: {
            email: address.address
        },
        displayName: displayName
    }
}

module.exports = {userToAddress, emailToAddress}

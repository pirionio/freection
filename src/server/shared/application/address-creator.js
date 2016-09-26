import AddressParser from 'email-addresses'

import UserTypes from '../../../common/enums/user-types'

export function userToAddress(user) {
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

export function emailToAddress(email, name) {
    const address = AddressParser.parseOneAddress(email)

    let displayName

    if (name)
        displayName = name
    else if (address.name)
        displayName = address.name
    else
        displayName = `<${address.address}>`

    return {
        id: address.address,
        type: UserTypes.EMAIL.key,
        payload: {
            email: address.address
        },
        displayName: displayName
    }
}
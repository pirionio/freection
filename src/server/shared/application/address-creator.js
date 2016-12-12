import UserTypes from '../../../common/enums/user-types'
import {BOT} from '../constants'

export function userToAddress(user) {
    return {
        id: user.id,
        type: UserTypes.FREECTION.key,
        displayName: `${user.firstName} ${user.lastName}`,
        payload: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
            organization: user.organization
        }
    }
}

export function botToAddress() {
    return {
        id: BOT.EMAIL,
        type: UserTypes.BOT.key,
        payload: {
            email: BOT.EMAIL
        },
        displayName: UserTypes.BOT.label
    }
}

export {emailToAddress} from '../../../common/util/email-to-address'
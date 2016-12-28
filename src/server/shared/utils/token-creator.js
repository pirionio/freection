import {userToDto} from '../application/transformers'

export function createUserToken(user) {
    return userToDto(user)
}

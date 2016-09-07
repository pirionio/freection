import ContactsActionsTypes from '../types/contacts-action-types'
import {ActionStatus} from '../../constants'
import ResourceUtil from '../../util/resource-util'

export function setState(contacts) {
    return {
        type: ContactsActionsTypes.SET_STATE,
        contacts
    }
}

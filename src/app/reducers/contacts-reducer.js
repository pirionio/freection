import ContactsActionTypes from '../actions/types/contacts-action-types'

export default function(state = [], action) {
    if (action.type === ContactsActionTypes.SET_STATE) {
        return action.contacts
    }

    return state
}
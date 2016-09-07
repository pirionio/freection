import ContactsActionTypes from '../actions/types/contacts-action-types'

module.exports = function(state = [], action) {
    if (action.type === ContactsActionTypes.SET_STATE) {
        return action.contacts
    }

    return state
}
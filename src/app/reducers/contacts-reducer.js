import ContactsActionTypes from '../actions/types/contacts-action-types'
import {ActionStatus} from '../constants.js'
import immutable from '../util/immutable.js'

const initialValue = {
    contacts: [],
    query: '',
    pendingQuery: ''
}

export default function(state = initialValue, action) {
    switch (action.type) {
        case ContactsActionTypes.GET:
            if (action.status === ActionStatus.START) {
                return immutable(state)
                    .set('pendingQuery', action.query)
                    .value()
            }
            else if (action.status === ActionStatus.COMPLETE) {
                // If multiple queries where issues, we only address the last one
                if (state.pendingQuery === action.query) {
                    return immutable(state)
                        .set('query', action.query)
                        .set('contacts', action.contacts)
                        .set('pendingQuery', '')
                        .value()
                }
            }
            break
        case ContactsActionTypes.CLEAR:
            return initialValue
    }

    return state
}
import ToActionTypes from '../actions/types/to-action-types'
import {ActionStatus} from '../constants.js'
import immutable from '../util/immutable.js'

const initialValue = {
    contacts: [],
    cache: {},
    query: '',
    activatingQuery: '',
    pendingQueries: []
}

export default function(state = initialValue, action) {
    switch (action.type) {
        case ToActionTypes.GET_FROM_CACHE:
            return immutable(state)
                .set('contacts', state.cache[action.query])
                .set('query', action.query)
                .value()
        case ToActionTypes.GET:
            if (action.status === ActionStatus.START) {
                if (action.forCacheOnly) {
                    return immutable(state)
                        .arrayPushItem('pendingQueries', action.query)
                        .value()
                }

                return immutable(state)
                    .set('activatingQuery', action.query)
                    .arrayPushItem('pendingQueries', action.query)
                    .value()
            }
            else if (action.status === ActionStatus.COMPLETE) {
                // If multiple queries where issues, we only address the last one
                if (state.activatingQuery === action.query) {
                    return immutable(state)
                        .set('query', action.query)
                        .set('contacts', action.contacts)
                        .set('activatingQuery', '')
                        .touch('cache')
                        .set(['cache', action.query], action.contacts)
                        .arrayReject('pendingQueries', action.query)
                        .value()
                }

                // Just adding to the cache
                return immutable(state)
                    .touch('cache')
                    .set(['cache', action.query], action.contacts)
                    .arrayReject('pendingQueries', action.query)
                    .value()
            }
            break
        case ToActionTypes.CLEAR:
            return immutable(state)
                .set('contacts', [])
                .set('query', '')
                .set('activatingQuery', '')
                .value()
    }

    return state
}
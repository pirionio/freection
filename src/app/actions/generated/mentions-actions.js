import MentionsActionsTypes from '../types/mentions-action-types'
import {ActionStatus} from '../../constants'
import * as ResourceUtil from '../../util/resource-util'

export function setState(things) {
    return {
        type: MentionsActionsTypes.SET_STATE,
        things
    }
}

export function _fetchMentions() {
    return dispatch => {
        dispatch({
            type: MentionsActionsTypes.FETCH_MENTIONS, 
            status: ActionStatus.START            
        })
        return ResourceUtil.get(`/api/things/mentions`)
            .then(result => dispatch({
                type: MentionsActionsTypes.FETCH_MENTIONS, 
                status: ActionStatus.COMPLETE,
                things: result
            }))
            .catch((error) => {
                console.log('error:', error)
                return dispatch({
                    type: MentionsActionsTypes.FETCH_MENTIONS,
                    status: ActionStatus.ERROR
                })
            })
    }
}

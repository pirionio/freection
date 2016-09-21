import SlackActionsTypes from '../types/slack-action-types'
import {ActionStatus} from '../../constants'
import * as ResourceUtil from '../../util/resource-util'

export function fetch() {
    return dispatch => {
        dispatch({
            type: SlackActionsTypes.FETCH, 
            status: ActionStatus.START            
        })
        return ResourceUtil.get(`/api/slack`)
            .then(result => dispatch({
                type: SlackActionsTypes.FETCH, 
                status: ActionStatus.COMPLETE,
                slack: result
            }))
            .catch(() => dispatch({
                type: SlackActionsTypes.FETCH, 
                status: ActionStatus.ERROR                
            }))
    }
}

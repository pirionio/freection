import ThingPageActionsTypes from '../types/thing-page-action-types'
import {ActionStatus} from '../../constants'
import * as ResourceUtil from '../../util/resource-util'

export function _show(thing) {
    return {
        type: ThingPageActionsTypes.SHOW,
        thing
    }
}

export function _hide() {
    return {
        type: ThingPageActionsTypes.HIDE        
    }
}

export function _getThing(thingId) {
    return dispatch => {
        dispatch({
            type: ThingPageActionsTypes.GET_THING, 
            status: ActionStatus.START,
            thingId
        })
        return ResourceUtil.get(`/api/things/${thingId}`)
            .then(result => dispatch({
                type: ThingPageActionsTypes.GET_THING, 
                status: ActionStatus.COMPLETE,
                thing: result
            }))
            .catch(() => dispatch({
                type: ThingPageActionsTypes.GET_THING, 
                status: ActionStatus.ERROR,
                thingId
            }))
    }
}

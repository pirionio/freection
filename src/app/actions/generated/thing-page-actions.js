import ThingPageActionsTypes from '../types/thing-page-action-types'
import {ActionStatus} from '../../constants'
import * as ResourceUtil from '../../util/resource-util'

export function _showThingPage(thing) {
    return {
        type: ThingPageActionsTypes.SHOW_THING_PAGE,
        thing
    }
}

export function _hideThingPage() {
    return {
        type: ThingPageActionsTypes.HIDE_THING_PAGE        
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

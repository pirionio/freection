const ThingPageActionsTypes = require('../types/thing-page-action-types')
const {ActionStatus} = require('../../constants')
const ResourceUtil = require('../../util/resource-util')

function show(thingId) {
    return {
        type: ThingPageActionsTypes.SHOW,
        thingId
    }
}

function hide() {
    return {
        type: ThingPageActionsTypes.HIDE        
    }
}

function get(thingId) {
    return dispatch => {
        dispatch({
            type: ThingPageActionsTypes.GET, 
            status: ActionStatus.START,
            thingId
        })
        return ResourceUtil.get(`/api/things/${thingId}`)
            .then(result => dispatch({
                type: ThingPageActionsTypes.GET, 
                status: ActionStatus.COMPLETE,
                thing: result
            }))
            .catch(() => dispatch({
                type: ThingPageActionsTypes.GET, 
                status: ActionStatus.ERROR,
                thingId
            }))
    }
}

module.exports = {
    show,
    hide,
    get
}
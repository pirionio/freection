const ThingPageActionsTypes = require('../types/thing-page-action-types')
const {ActionStatus} = require('../../constants')
const ResourceUtil = require('../../util/resource-util')

function showThingPage(thing) {
    return {
        type: ThingPageActionsTypes.SHOW_THING_PAGE,
        thing
    }
}

function hideThingPage() {
    return {
        type: ThingPageActionsTypes.HIDE_THING_PAGE        
    }
}

function getThing(thingId) {
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

module.exports = {
    showThingPage,
    hideThingPage,
    getThing
}
const WhatsNewActionTypes = require('./types/whats-new-action-types')
const ResourceUtil = require('../util/resource-util')
const {ActionStatus} = require('../constants')

function abortThingRequest(thing) {
    return {
        type: WhatsNewActionTypes.ABORT_THING,
        status: ActionStatus.START,
        thing
    }
}

function abortThingComplete(thing) {
    return {
        type: WhatsNewActionTypes.ABORT_THING,
        status: ActionStatus.COMPLETE,
        thing
    }
}

function abortThingFailed(thing) {
    return {
        type: WhatsNewActionTypes.ABORT_THING,
        status: ActionStatus.ERROR,
        thing
    }
}

const abortThing = (thing) => {
    return dispatch => {
        dispatch(abortThingRequest(thing))
        ResourceUtil.post(`/api/things/${thing.id}/abort`).
            then(() => dispatch(abortThingComplete(thing))).
            catch(() => dispatch(abortThingFailed(thing))
        )
    }
}

module.exports = {abortThing}
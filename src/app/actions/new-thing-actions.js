const ThingActionsTypes = require('./types/thing-action-types')
const ThingService = require('../services/thing-service')
const {ActionStatus} = require('../constants')

function sendNewThing(thing) {
    return {
        type: ThingActionsTypes.NEW_THING,
        status: ActionStatus.START,
        thing
    }
}

function newThingComplete() {
    return {
        type: ThingActionsTypes.NEW_THING,
        status: ActionStatus.COMPLETE
    }
}

const createNewThing = (thing) => {
    return dispatch => {
        dispatch(sendNewThing(thing))
        ThingService.createNewThing({
            to: thing.to,
            body: thing.body,
            subject: thing.subject
        }).then(() => {
            dispatch(newThingComplete())
        })
    }
}

module.exports = {createNewThing}
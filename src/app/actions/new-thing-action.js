const NewThingActions = require('./types/new-thing-action-types')
const NewThingService = require('../services/new-thing-service')
const {ActionStatus} = require('../constants')

function sendNewThing(thing) {
    return {
        type: NewThingActions.NEW_THING,
        status: ActionStatus.START,
        thing
    }
}

function newThingComplete() {
    return {
        type: NewThingActions.NEW_THING,
        status: ActionStatus.COMPLETE
    }
}

const createNewThing = (thing) => {
    return dispatch => {
        dispatch(sendNewThing(thing))
        NewThingService.createNewThing({
            to: thing.to,
            body: thing.body,
            subject: thing.subject
        }).then(() => {
            dispatch(newThingComplete())
        })
    }
}

module.exports = {createNewThing}
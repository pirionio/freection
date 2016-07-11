const NewThingActionTypes = require('../actions/types/new-thing-action-types')
const {ActionStatus} = require('../constants')

const initialState = {
    thing: {}
}

function createNewThing(state, action) {
    switch (action.status) {
        case ActionStatus.START:
            return {
                thing: action.thing
            }
        case ActionStatus.COMPLETE:
            return {
                thing: {}
            }
        default:
            return {
                thing: {}
            }
    }
}

module.exports = (state = initialState, action) => {
    switch (action.type) {
        case NewThingActionTypes.NEW_THING:
            return createNewThing(state, action)
        default:
            return state
    }
}
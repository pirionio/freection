const WhatsNewActionTypes = require('../actions/types/whats-new-action-types')
const {ActionStatus} = require('../constants')
const {filter} = require('lodash')

const initialState = {
    things: []
}

function fetchWhatsNew(state, action) {
    switch (action.status) {
        case ActionStatus.COMPLETE:
            return {
                things: action.things
            }
        case ActionStatus.START:
        default:
            return {
                things: state.things
            }
    }
}

function doThing(state, action) {
    switch (action.status) {
        case ActionStatus.COMPLETE:
            return {
                things: filter(state.things, thing => thing.id !== action.thing.id)
            }
        case ActionStatus.START:
        case ActionStatus.ERROR:
        default:
            return {
                things: state.things
            }
    }
}

module.exports = (state = initialState, action) => {
    switch (action.type) {
        case WhatsNewActionTypes.FETCH_WHATS_NEW:
            return fetchWhatsNew(state, action)
        case WhatsNewActionTypes.DO_THING:
            return doThing(state, action)
        default:
            return state
    }
}
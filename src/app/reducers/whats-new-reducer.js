const WhatsNewActionTypes = require('../actions/types/whats-new-action-types')
const {ActionStatus} = require('../constants')

const initialState = {
    things: [],
    isFetching: false
}

function fetchWhatsNew(state, action) {
    switch (action.status) {
        case ActionStatus.START:
            return {
                things: state.things,
                isFetching: true
            }
        case ActionStatus.COMPLETE:
            return {
                things: action.things,
                isFetching: false
            }
        default:
            return {
                things: state.things,
                isFetching: false
            }
    }
}

module.exports = (state = initialState, action) => {
    switch (action.type) {
        case WhatsNewActionTypes.FETCH_WHATS_NEW:
            return fetchWhatsNew(state, action)
        default:
            return {
                things: state.things,
                isFetching: false
            }
    }
}
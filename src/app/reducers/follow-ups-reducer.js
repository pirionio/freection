const FollowUpsActionTypes = require('../actions/types/follow-up-action-types')
const {ActionStatus} = require('../constants')

const initialState = {
    followUps: []
}

function fetchFollowUps(state, action) {
    switch (action.status) {
        case ActionStatus.COMPLETE:
            return {
                followUps: action.followUps
            }
        case ActionStatus.START:
        default:
            return {
                followUps: state.followUps
            }
    }
}

module.exports = (state = initialState, action) => {
    switch (action.type) {
        case FollowUpsActionTypes.FETCH_FOLLOW_UPS:
            return fetchFollowUps(state, action)
        default:
            return state
    }
}
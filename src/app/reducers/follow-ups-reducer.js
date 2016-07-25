const {some} = require('lodash/core')

const FollowUpsActionTypes = require('../actions/types/follow-up-action-types')
const ThingActionTypes = require('../actions/types/thing-action-types')
const {ActionStatus} = require('../constants')
const immutable = require('../util/immutable')
const thingReducer = require('./thing-reducer')

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

function createdReceived(state, action) {
    if (!action.thing.isFollowUper)
        return state

    // already exist?
    if (some(state.followUps, thing => thing.id === action.thing.id))
        return state

    // Adding to array
    return Object.assign({}, state, {
        followUps: [...state.followUps, action.thing]
    })
}

module.exports = (state = initialState, action) => {
    switch (action.type) {
        case FollowUpsActionTypes.FETCH_FOLLOW_UPS:
            return fetchFollowUps(state, action)
        case ThingActionTypes.CREATED_RECEIVED:
            return createdReceived(state, action)
        case ThingActionTypes.NEW_COMMENT_RECEIVED:
        case ThingActionTypes.COMMENT_READ_BY_RECEIVED:
            return immutable(state)
                .arraySetItem('followUps', {id: action.comment.thing.id}, item => thingReducer(item, action))
                .value()
        default:
            return state
    }
}
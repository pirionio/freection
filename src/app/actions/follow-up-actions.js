const FollowUpActionTypes = require('./types/follow-up-action-types')
const FollowUpService = require('../services/follow-up-service')
const {ActionStatus} = require('../constants')

function requestFollowUps() {
    return {
        type: FollowUpActionTypes.FETCH_FOLLOW_UPS,
        status: ActionStatus.START
    }
}

function requestFollowUpsComplete(followUps) {
    return {
        type: FollowUpActionTypes.FETCH_FOLLOW_UPS,
        status: ActionStatus.COMPLETE,
        followUps
    }
}

function requestFollowUpsFailed() {
    return {
        type: FollowUpActionTypes.FETCH_FOLLOW_UPS,
        status: ActionStatus.ERROR
    }
}

const fetchFollowUps = () => {
    return dispatch => {
        dispatch(requestFollowUps())
        FollowUpService.getFollowUps().
        then(followUps => dispatch(requestFollowUpsComplete(followUps))).
        catch(() => dispatch(requestFollowUpsFailed()))
    }
}

module.exports = {fetchFollowUps}

const FollowUpActions = require('./generated/follow-up-actions')
const {InvalidationStatus} = require('../constants')

const fetchFollowUpsActions = FollowUpActions.fetchFollowUps

const fetchFollowUps = () => {
    return (dispatch, getState) => {
        const {followUps} = getState()
        if (followUps.invalidationStatus === InvalidationStatus.INVALIDATED ||
            followUps.invalidationStatus === InvalidationStatus.REQUIRE_UPDATE) {
            dispatch(fetchFollowUpsActions())
        }
    }
}

module.exports = FollowUpActions
FollowUpActions.fetchFollowUps = fetchFollowUps
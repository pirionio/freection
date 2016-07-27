const FollowUpActionsTypes = require('../types/follow-up-action-types')
const {ActionStatus} = require('../../constants')
const ResourceUtil = require('../../util/resource-util')

function fetchFollowUps() {
    return dispatch => {
        dispatch({
            type: FollowUpActionsTypes.FETCH_FOLLOW_UPS, 
            status: ActionStatus.START            
        })
        return ResourceUtil.get(`/api/things/followups`)
            .then(result => dispatch({
                type: FollowUpActionsTypes.FETCH_FOLLOW_UPS, 
                status: ActionStatus.COMPLETE,
                followUps: result
            }))
            .catch(() => dispatch({
                type: FollowUpActionsTypes.FETCH_FOLLOW_UPS, 
                status: ActionStatus.ERROR                
            }))
    }
}

module.exports = {
    fetchFollowUps
}
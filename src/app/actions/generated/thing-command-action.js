const ThingCommandActionsTypes = require('../types/thing-command-action-types')
const {ActionStatus} = require('../../constants')
const ResourceUtil = require('../../util/resource-util')

function comment(thingId, commentText) {
    return dispatch => {
        dispatch({
            type: ThingCommandActionsTypes.COMMENT, 
            status: ActionStatus.START,
            thingId,
            commentText
        })
        return ResourceUtil.post(`/api/things/${thingId}/comment`, {
                commentText: commentText
            })
            .then(result => dispatch({
                type: ThingCommandActionsTypes.COMMENT, 
                status: ActionStatus.COMPLETE,
                thingId: thingId,
                comment: result
            }))
            .catch(() => dispatch({
                type: ThingCommandActionsTypes.COMMENT, 
                status: ActionStatus.ERROR,
                thingId,
                commentText
            }))
    }
}

module.exports = {
    comment
}
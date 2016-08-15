const AuthActionsTypes = require('../types/auth-action-types')
const {ActionStatus} = require('../../constants')
const ResourceUtil = require('../../util/resource-util')

function setState(state) {
    return {
        type: AuthActionsTypes.SET_STATE,
        state
    }
}

module.exports = {
    setState
}
const ThingCommandActions = require('./generated/thing-command-action')
const {actions} = require('react-redux-form')

const commentAction = ThingCommandActions.comment

function comment(thingId, commentText) {
    return dispatch => {
        const promise = dispatch(commentAction(thingId, commentText))

        // This action takes care of the state of the message box itself.
        dispatch(actions.submit('messageBox', promise)).then(() => dispatch(actions.reset('messageBox')))
    }
}

module.exports = ThingCommandActions
module.exports.comment = comment
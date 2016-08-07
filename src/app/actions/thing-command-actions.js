const ThingCommandActions = require('./generated/thing-command-actions')
const MessageBoxActions = require('./message-box-actions')

const commentAction = ThingCommandActions.comment
const newThingAction = ThingCommandActions.newThing

function comment(thingId, commentText) {
    return dispatch => {
        const promise = dispatch(commentAction(thingId, commentText))
        MessageBoxActions.newMessage(dispatch, promise, 'commentThingBox')
    }
}

function newThing(thing) {
    return dispatch => {
        const promise = dispatch(newThingAction(thing))
        MessageBoxActions.newMessage(dispatch, promise, 'newMessageBox')
    }
}

module.exports = ThingCommandActions
module.exports.comment = comment
module.exports.newThing = newThing
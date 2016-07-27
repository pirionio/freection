const ThingCommandActions = require('./generated/thing-command-actions')
const {actions} = require('react-redux-form')

const commentAction = ThingCommandActions.comment
const newThingAction = ThingCommandActions.newThing

function comment(thingId, commentText) {
    return dispatch => {
        const promise = dispatch(commentAction(thingId, commentText))

        // This action takes care of the state of the message box itself.
        dispatch(actions.submit('messageBox', promise)).then(() => dispatch(actions.reset('messageBox')))
    }
}

function newThing(thing) {
    return dispatch => {
        const promise = dispatch(newThingAction(thing))

        dispatch(actions.submit('messageBox', promise)).then(() => dispatch(actions.reset('messageBox')))
    }
}



module.exports = ThingCommandActions
module.exports.comment = comment
module.exports.newThing = newThing
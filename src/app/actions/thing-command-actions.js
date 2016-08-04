const ThingCommandActions = require('./generated/thing-command-actions')
const {actions} = require('react-redux-form')

const {GeneralConstants} = require('../constants')

const commentAction = ThingCommandActions.comment
const newThingAction = ThingCommandActions.newThing

function comment(thingId, commentText) {
    return dispatch => {
        const promise = dispatch(commentAction(thingId, commentText))
        handleMessageBox(dispatch, promise)
    }
}

function newThing(thing) {
    return dispatch => {
        const promise = dispatch(newThingAction(thing))
        handleMessageBox(dispatch, promise)
    }
}

function handleMessageBox(dispatch, promise) {
        const ongoingActionTimeout = setTimeout(() => {
            dispatch(actions.change('messageBox.ongoingAction', true))
        }, GeneralConstants.ONGOING_ACTION_DELAY_MILLIS)

        dispatch(actions.submit('messageBox', promise)).then(() => {
            clearTimeout(ongoingActionTimeout)

            dispatch(actions.change('messageBox.ongoingAction', false))
            dispatch(actions.reset('messageBox'))
        })
}

module.exports = ThingCommandActions
module.exports.comment = comment
module.exports.newThing = newThing
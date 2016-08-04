const ThingCommandActions = require('./generated/thing-command-actions')
const {actions} = require('react-redux-form')

const {GeneralConstants} = require('../constants')

const commentAction = ThingCommandActions.comment
const newThingAction = ThingCommandActions.newThing

function comment(thingId, commentText) {
    return dispatch => {
        const promise = dispatch(commentAction(thingId, commentText))
        handleMessageBox(dispatch, promise, 'commentThingBox')
    }
}

function newThing(thing, selectedOption) {
    return dispatch => {
        const promise = dispatch(newThingAction(thing, selectedOption))
        handleMessageBox(dispatch, promise, 'newThingBox')
    }
}

function handleMessageBox(dispatch, promise, stateName) {
        const ongoingActionTimeout = setTimeout(() => {
            dispatch(actions.change(`${stateName}.ongoingAction`, true))
        }, GeneralConstants.ONGOING_ACTION_DELAY_MILLIS)

        dispatch(actions.submit(stateName, promise)).then(() => {
            clearTimeout(ongoingActionTimeout)

            dispatch(actions.change(`${stateName}.ongoingAction`, false))
            dispatch(actions.reset(stateName))
        })
}

module.exports = ThingCommandActions
module.exports.comment = comment
module.exports.newThing = newThing
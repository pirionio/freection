const {actions} = require('react-redux-form')
const ThingService = require('../services/thing-service')

function createNewThing(dispatch, thing) {
    var promise = ThingService.createNewThing({
        to: thing.to,
        body: thing.body,
        subject: thing.subject
    })
    dispatch(actions.submit('newThing', promise)).then(() => dispatch(actions.reset('newThing')))
}

module.exports.createNewThing = createNewThing
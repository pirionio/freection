const {modelReducer, formReducer} = require('react-redux-form')

const initialState = {
    to: '',
    body: '',
    subject: ''
}

module.exports = {
    newThing: modelReducer('newThing', initialState),
    newThingForm: formReducer('newThing', initialState)
}
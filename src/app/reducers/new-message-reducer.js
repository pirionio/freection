const {modelReducer, formReducer} = require('react-redux-form')

const initialState = {
    to: '',
    body: '',
    subject: ''
}

module.exports = {
    newMessage: modelReducer('newMessage', initialState),
    newMessageForm: formReducer('newMessage', initialState)
}
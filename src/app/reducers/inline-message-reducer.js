const {modelReducer, formReducer} = require('react-redux-form')

const initialState = {
    show: false,
    text: '',
    action: null,
    ongoingAction: null
}

module.exports = {
    inlineMessage: modelReducer('inlineMessage', initialState),
    inlineMessageForm: formReducer('inlineMessage', initialState)
}
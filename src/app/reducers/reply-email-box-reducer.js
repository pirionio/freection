const {modelReducer, formReducer} = require('react-redux-form')

const initialState = {
    text: '',
    ongoingAction: false
}

module.exports = {
    replyEmailBox: modelReducer('replyEmailBox', initialState),
    replyEmailBoxForm: formReducer('replyEmailBox', initialState)
}
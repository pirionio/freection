const {modelReducer, formReducer} = require('react-redux-form')

const initialState = {
    message: {
        to: '',
        body: '',
        subject: ''
    },
    ongoingAction: false
}

module.exports = {
    messageBox: modelReducer('messageBox', initialState),
    messageBoxForm: formReducer('messageBox', initialState)
}
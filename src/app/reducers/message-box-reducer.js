const {modelReducer, formReducer} = require('react-redux-form')

const initialState = {
    message: {
        to: '',
        body: '',
        subject: ''
    }
}

module.exports = {
    messageBox: modelReducer('messageBox', initialState),
    messageBoxForm: formReducer('messageBox', initialState)
}
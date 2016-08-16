const {modelReducer, formReducer} = require('react-redux-form')

const initialState = {
    id: null,
    type: null,
    context: null,
    title: '',
    ongoingAction: false,
    focusOn: null,
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
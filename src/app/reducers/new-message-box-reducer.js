const {modelReducer, formReducer} = require('react-redux-form')
const MessageTypes = require('../../common/enums/message-types')

const initialState = {
    message: {
        to: '',
        body: '',
        subject: ''
    },
    ongoingAction: false,
    selectedOption: MessageTypes.NEW_THING
}

module.exports = {
    newMessageBox: modelReducer('newMessageBox', initialState),
    newMessageBoxForm: formReducer('newMessageBox', initialState)
}
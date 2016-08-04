const {modelReducer, formReducer} = require('react-redux-form')
const NewMessageTypes = require('../../common/enums/new-message-types')

const initialState = {
    message: {
        to: '',
        body: '',
        subject: ''
    },
    ongoingAction: false,
    selectedOption: NewMessageTypes.THING
}

module.exports = {
    newThingBox: modelReducer('newThingBox', initialState),
    newThingBoxForm: formReducer('newThingBox', initialState)
}
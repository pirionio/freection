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
    newThingBox: modelReducer('newThingBox', initialState),
    newThingBoxForm: formReducer('newThingBox', initialState)
}
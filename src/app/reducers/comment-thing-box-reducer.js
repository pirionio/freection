const {modelReducer, formReducer} = require('react-redux-form')

const initialState = {
    text: '',
    ongoingAction: false
}

module.exports = {
    commentThingBox: modelReducer('commentThingBox', initialState),
    commentThingBoxForm: formReducer('commentThingBox', initialState)
}
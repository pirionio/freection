import {modelReducer, formReducer} from 'react-redux-form'

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
    },
    editorState: null
}

export const messageBox = modelReducer('messageBox', initialState)
export const messageBoxForm = formReducer('messageBox', initialState)
import {modelReducer, formReducer} from 'react-redux-form'

const initialState = {
    show: false,
    text: '',
    action: null,
    ongoingAction: null
}


export const inlineMessage = modelReducer('inlineMessage', initialState)
export const inlineMessageForm = formReducer('inlineMessage', initialState)

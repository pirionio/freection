import {actions} from 'react-redux-form'

import * as GlassPaneActions from '../actions/glass-pane-actions'

export function show(action) {
    return dispatch => {
        dispatch(actions.change('inlineMessage', {show: true, action}))
        dispatch(GlassPaneActions.show(() => {
            dispatch(close())
        }))
    }
}

export function close() {
    return dispatch => {
        dispatch(actions.reset('inlineMessage'))
        dispatch(GlassPaneActions.hide())
    }
}

export function messageSent(inlineMessage) {
    return dispatch => {
        inlineMessage.action(inlineMessage.text)
        dispatch(actions.reset('inlineMessage'))
        dispatch(GlassPaneActions.hide())
    }
}
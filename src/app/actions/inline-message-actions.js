import {actions} from 'react-redux-form'

import * as GlassPaneActions from '../actions/glass-pane-actions'
import {GlassPaneIds} from '../constants'

export function show(action) {
    return dispatch => {
        dispatch(actions.change('inlineMessage', {show: true, action}))
        dispatch(GlassPaneActions.show(GlassPaneIds.MAIN_APP, () => {
            dispatch(close())
        }))
    }
}

export function close() {
    return dispatch => {
        dispatch(actions.reset('inlineMessage'))
        dispatch(GlassPaneActions.hide(GlassPaneIds.MAIN_APP))
    }
}

export function messageSent(inlineMessage) {
    return dispatch => {
        inlineMessage.action(inlineMessage.text)
        dispatch(actions.reset('inlineMessage'))
        dispatch(GlassPaneActions.hide(GlassPaneIds.MAIN_APP))
    }
}
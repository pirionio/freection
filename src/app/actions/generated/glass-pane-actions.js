import GlassPaneActionsTypes from '../types/glass-pane-action-types'
import {ActionStatus} from '../../constants'
import * as ResourceUtil from '../../util/resource-util'

export function show(id,backdropCallback) {
    return {
        type: GlassPaneActionsTypes.SHOW,
        id,
        backdropCallback
    }
}

export function hide(id) {
    return {
        type: GlassPaneActionsTypes.HIDE,
        id
    }
}

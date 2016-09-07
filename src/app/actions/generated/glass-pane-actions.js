import GlassPaneActionsTypes from '../types/glass-pane-action-types'
import {ActionStatus} from '../../constants'
import ResourceUtil from '../../util/resource-util'

export function show(backdropCallback) {
    return {
        type: GlassPaneActionsTypes.SHOW,
        backdropCallback
    }
}

export function hide() {
    return {
        type: GlassPaneActionsTypes.HIDE        
    }
}

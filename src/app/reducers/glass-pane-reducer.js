import GlassPaneActionTypes from '../actions/types/glass-pane-action-types'

import immutable from '../util/immutable'

const initialState = {
    glassPanes: []
}


export default (state = initialState, action) => {
    switch (action.type) {
        case GlassPaneActionTypes.SHOW:
            return immutable(state)
                .arraySetOrPushItem('glassPanes', {id: action.id}, {
                    id: action.id,
                    show: true,
                    backdropCallback: action.backdropCallback
                })
                .value()
        case GlassPaneActionTypes.HIDE:
            return immutable(state)
                .arraySetOrPushItem('glassPanes', {id: action.id}, {
                    id: action.id,
                    show: false
                })
                .value()
        default:
            return state
    }
}
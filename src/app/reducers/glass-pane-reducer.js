import GlassPaneActionTypes from '../actions/types/glass-pane-action-types'

const initialState = {
    show: false,
    backdropCallback: null
}

module.exports = (state = initialState, action) => {
    switch (action.type) {
        case GlassPaneActionTypes.SHOW:
            return {
                show: true,
                backdropCallback: action.backdropCallback
            }
        case GlassPaneActionTypes.HIDE:
            return {
                show: false,
                backdropCallback: null
            }
        default:
            return state
    }
}
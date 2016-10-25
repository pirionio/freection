const GlassPaneActionsTypes = {
    SHOW: 'GLASS_PANE_SHOW',
    HIDE: 'GLASS_PANE_HIDE'
}

export default GlassPaneActionsTypes

export function isOfTypeGlassPane(type) {
    switch(type) {
        case GlassPaneActionsTypes.SHOW:
        case GlassPaneActionsTypes.HIDE:
            return true
        default:
            return false
    }
}
const GlassPaneActionsTypes = require('../types/glass-pane-action-types')
const {ActionStatus} = require('../../constants')
const ResourceUtil = require('../../util/resource-util')

function show(backdropCallback) {
    return {
        type: GlassPaneActionsTypes.SHOW,
        backdropCallback
    }
}

function hide() {
    return {
        type: GlassPaneActionsTypes.HIDE        
    }
}

module.exports = {
    show,
    hide
}
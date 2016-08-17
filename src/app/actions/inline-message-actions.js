const {actions} = require('react-redux-form')

const GlassPaneActions = require('../actions/glass-pane-actions')

function show(action) {
    return dispatch => {
        dispatch(actions.change('inlineMessage', {show: true, action}))
        dispatch(GlassPaneActions.show(() => {
            dispatch(close())
        }))
    }
}

function close() {
    return dispatch => {
        dispatch(actions.reset('inlineMessage'))
        dispatch(GlassPaneActions.hide())
    }
}

function messageSent(inlineMessage) {
    return dispatch => {
        inlineMessage.action(inlineMessage.text)
        dispatch(actions.reset('inlineMessage'))
        dispatch(GlassPaneActions.hide())
    }
}

module.exports.show = show
module.exports.close = close
module.exports.messageSent = messageSent
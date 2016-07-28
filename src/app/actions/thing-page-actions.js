const ThingPageActions = require('./generated/thing-page-actions')
const {push, goBack} = require('react-router-redux')

const showAction = ThingPageActions.show

function show(thingId) {
    return dispatch => {
        dispatch(push(`tasks/${thingId}`))

        dispatch(showAction(thingId))
    }
}

const hideAction = ThingPageActions.hide

function hide() {
    return dispatch => {
        dispatch(hideAction())
    }
}

module.exports = ThingPageActions
ThingPageActions.show = show
ThingPageActions.hide = hide
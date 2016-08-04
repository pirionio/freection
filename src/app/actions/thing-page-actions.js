const {push} = require('react-router-redux')

const ThingPageActions = require('./generated/thing-page-actions')
const {InvalidationStatus} = require('../constants')

const getAction = ThingPageActions.get
const showAction = ThingPageActions.show
const hideAction = ThingPageActions.hide

function get(thingId) {
    return (dispatch, getState) => {
        const {thingPage} = getState()
        if (thingPage.invalidationStatus === InvalidationStatus.INVALIDATED) {
            return dispatch(getAction(thingId))
        }
    }
}

function show(thingId) {
    return dispatch => {
        dispatch(push(`things/${thingId}`))

        dispatch(showAction(thingId))
    }
}

function hide() {
    return dispatch => {
        dispatch(hideAction())
    }
}

module.exports = ThingPageActions
ThingPageActions.get = get
ThingPageActions.show = show
ThingPageActions.hide = hide

const {push} = require('react-router-redux')
const find = require('lodash/find')

const ThingPageActions = require('./generated/thing-page-actions')
const MessageBoxActions = require('./message-box-actions')
const {InvalidationStatus} = require('../constants')
import MessageTypes from '../../common/enums/message-types'

const getAction = ThingPageActions.getThing
const showAction = ThingPageActions.showThingPage
const hideAction = ThingPageActions.hideThingPage

function getThing(thingId) {
    return (dispatch, getState) => {
        const {thingPage} = getState()
        if (thingPage.invalidationStatus === InvalidationStatus.INVALIDATED ||
            thingPage.invalidationStatus === InvalidationStatus.REQUIRE_UPDATE) {
            return dispatch(getAction(thingId))
        }
    }
}

function showThingPage(thing) {
    return dispatch => {
        dispatch(push(`${window.location.pathname}/${thing.id}`))
        dispatch(showAction(thing))
        dispatch(MessageBoxActions.newMessageBox(MessageTypes.COMMENT_THING, thing))
    }
}

function hideThingPage() {
    return (dispatch, getState) => {
        const {thingPage, messagePanel} = getState()
        const thingId = thingPage.thing.id

        dispatch(hideAction())

        const thingMessageBox = find(messagePanel.messageBoxes, {context: {id: thingId}})
        thingMessageBox && dispatch(MessageBoxActions.closeMessageBox(thingMessageBox.id))
    }
}

module.exports = ThingPageActions
ThingPageActions.getThing = getThing
ThingPageActions.showThingPage = showThingPage
ThingPageActions.hideThingPage = hideThingPage

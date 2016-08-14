const {push} = require('react-router-redux')
const find = require('lodash/find')

const ThingPageActions = require('./generated/thing-page-actions')
const MessageBoxActions = require('./message-box-actions')
const {InvalidationStatus} = require('../constants')
const MessageTypes = require('../../common/enums/message-types')

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

function show(thing) {
    return dispatch => {
        dispatch(push(`/things/${thing.id}`))
        dispatch(showAction(thing))
        dispatch(MessageBoxActions.newMessage(MessageTypes.NEW_COMMENT, thing))
    }
}

function hide() {
    return (dispatch, getState) => {
        const {thingPage, newMessagePanel} = getState()
        const thingId = thingPage.thing.id

        dispatch(hideAction())

        const thingMessageBox = find(newMessagePanel.messageBoxes, {context: {id: thingId}})
        thingMessageBox && dispatch(MessageBoxActions.closeMessageBox(thingMessageBox))
    }
}

module.exports = ThingPageActions
ThingPageActions.get = get
ThingPageActions.show = show
ThingPageActions.hide = hide

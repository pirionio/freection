const {push} = require('react-router-redux')
const find = require('lodash/find')

import {_getThing, _showThingPage, _hideThingPage} from'./generated/thing-page-actions'
import * as MessageBoxActions from './message-box-actions'
const {InvalidationStatus} = require('../constants')
import MessageTypes from '../../common/enums/message-types'

export function getThing(thingId) {
    return (dispatch, getState) => {
        const {thingPage} = getState()
        if (thingPage.invalidationStatus === InvalidationStatus.INVALIDATED ||
            thingPage.invalidationStatus === InvalidationStatus.REQUIRE_UPDATE) {
            return dispatch(_getThing(thingId))
        }
    }
}

export function showThingPage(thing) {
    return dispatch => {
        dispatch(push(`${window.location.pathname}/${thing.id}`))
        dispatch(_showThingPage(thing))
        dispatch(MessageBoxActions.newMessageBox(MessageTypes.COMMENT_THING, thing))
    }
}

export function hideThingPage() {
    return (dispatch, getState) => {
        const {thingPage, messagePanel} = getState()
        const thingId = thingPage.thing.id

        dispatch(_hideThingPage())

        const thingMessageBox = find(messagePanel.messageBoxes, {context: {id: thingId}})
        thingMessageBox && dispatch(MessageBoxActions.closeMessageBox(thingMessageBox.id))
    }
}

export * from'./generated/thing-page-actions'
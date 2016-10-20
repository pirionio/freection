import {push} from 'react-router-redux'
import find from 'lodash/find'

import {_getThing, _show, _hide} from'./generated/thing-page-actions'
import * as MessageBoxActions from './message-box-actions'
import * as GlassPaneActions from '../actions/glass-pane-actions'
import {GlassPaneIds} from '../constants'
import {InvalidationStatus} from '../constants'
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

export function show(thing) {
    return (dispatch, getState) => {
        dispatch(push(`${window.location.pathname}/${thing.id}`))
        dispatch(GlassPaneActions.show(GlassPaneIds.MAIN_APP, () => {
            dispatch(GlassPaneActions.hide(GlassPaneIds.MAIN_APP))
        }))
        dispatch(_show(thing))

        // By default, entering the Thing page won't open a reply Message Box.
        // But, if the Message Box is already open, then we DO open a reply Message Box.
        // Otherwise, the user won't have the Collapsed bar to click on, in order to open a reply Message Box.
        const {messagePanel} = getState()
        if (messagePanel && messagePanel.messageBoxes && messagePanel.messageBoxes.length) {
            dispatch(MessageBoxActions.newMessageBox(MessageTypes.COMMENT_THING, thing))
        }
    }
}

export function hide() {
    return (dispatch, getState) => {
        const {thingPage, messagePanel} = getState()
        const thingId = thingPage.thing.id

        dispatch(GlassPaneActions.hide(GlassPaneIds.MAIN_APP))
        dispatch(_hide())

        const thingMessageBox = find(messagePanel.messageBoxes, {context: {id: thingId}})
        thingMessageBox && dispatch(MessageBoxActions.closeMessageBox(thingMessageBox.id))
    }
}

export * from'./generated/thing-page-actions'
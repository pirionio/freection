import {_comment, markCommentAsRead} from './generated/thing-command-actions'
import * as ThingsHelper from '../helpers/thing-helper'

export function comment(thingId, commentText) {
    return (dispatch, getState) => {
        const {thingPage} = getState()

        // Commenting should mark unread comments as read.
        // Notice that we take the ones that are marked as initially not read.
        // The idea is that when the user reads a comment and it is marked as read, the view is NOT changed -
        // the comment is still seen as unread, until the next time the user visits the page (this is the initially not read state).
        // In this context, however, we DO want the view to change, so that the comment is seen as read.
        // Also notice it's important to take the Thing from the thingPage state,
        // because it is the only state that's really updated with the unread status.
        if (thingPage.thing && thingPage.thing.id === thingId) {
            const unreadMessages = ThingsHelper.getInitialUnreadMessages(thingPage.thing)
            unreadMessages.map(message => dispatch(markCommentAsRead(message, true)))
        }

        return dispatch(_comment(thingId, commentText))
    }
}

export * from './generated/thing-command-actions'



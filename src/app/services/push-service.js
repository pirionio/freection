const SocketUtil = require('../util/socket-util')

const WhatsNewActions = require('../actions/whats-new-actions')
const ThingActions = require('../actions/thing-actions')
const EventTypes = require('../../common/enums/event-types')

function listenToUpdates(pushToken, dispatch) {
    const socket = SocketUtil.createSocket(pushToken)
    
    socket.on('new-event', event => {
        if (event.showNew)
            dispatch(WhatsNewActions.notificationReceived(event))

        if (event.eventType.key === EventTypes.COMMENT.key)
            dispatch(ThingActions.newCommentReceived(event))

        if (event.eventType.key === EventTypes.CREATED.key)
            dispatch(ThingActions.thingCreatedReceived(event.thing))
    })

    socket.on('notification-deleted', event => {
        dispatch(WhatsNewActions.notificationDeleted(event))
    })
}

module.exports = {listenToUpdates}
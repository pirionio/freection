const SocketUtil = require('../util/socket-util')

const WhatsNewActions = require('../actions/whats-new-actions')
const ThingActions = require('../actions/thing-actions')

function listenToUpdates(pushToken, dispatch) {
    const socket = SocketUtil.createSocket(pushToken)
    
    socket.on('whatsnew', notification => {
        dispatch(WhatsNewActions.notificationReceived(notification))
    })

    socket.on('new-comment', comment => {
        dispatch(ThingActions.newCommentReceived(comment))
    })
}

module.exports = {listenToUpdates}
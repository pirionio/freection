const SocketUtil = require('../util/socket-util')

const WhatsNewActions = require('../actions/whats-new-actions')

function listenToUpdates(pushToken, dispatch) {
    const socket = SocketUtil.createSocket(pushToken)
    
    socket.on('whatsnew', notification => {
        dispatch(WhatsNewActions.notificationReceived(notification))
    })
}

module.exports = {listenToUpdates}
import io from 'socket.io-client'

export function createSocket(pushToken) {
    const socket = io('', {path: '/push'})
    socket
        .on('connect', () => {
            socket.emit('authenticate', {token: pushToken})
        })
        .on('unauthorized', () => {
            // TODO Create a logout flow, originating from here.
            throw Error('User not authenticated')
        })

    return socket
}
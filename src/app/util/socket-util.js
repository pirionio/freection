import io from 'socket.io-client'

export function createSocket(email, pushToken) {

    const socket = io('', {path: '/push'})
    socket
        .on('connect', () => {
            socket.emit('authenticate', {token: pushToken})
        })
        .on('unauthorized', () => {
            window.location = `/login/google?hint=${email}`
        })

    return socket
}
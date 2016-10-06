import io from 'socket.io-client'

import {relogin} from '../services/auth-service.js'

export function createSocket(email, pushToken) {

    const socket = io('', {path: '/push'})
    socket
        .on('connect', () => {
            socket.emit('authenticate', {token: pushToken})
        })
        .on('unauthorized', () => relogin(email))

    return socket
}
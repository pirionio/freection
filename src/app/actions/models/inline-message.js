module.exports = {
    name: 'inline-message',
    actions: [
        {
            name: 'show',
            params: ['action'],
            type: 'custom'
        },
        {
            name: 'close',
            type: 'custom'
        },
        {
            name: 'messageSent',
            params: ['messageText'],
            type: 'custom'
        }
    ]
}

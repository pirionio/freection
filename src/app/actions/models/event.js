module.exports = {
    name: 'event',
    actions: [
        {
            name: 'created',
            params: ['thing']
        },
        {
            name: 'accepted',
            params: ['thing']
        },
        {
            name: 'marked as done',
            params: ['thing']
        },
        {
            name: 'closed',
            params: ['thing']
        },
        {
            name: 'close acked',
            params: ['thing']
        },
        {
            name: 'dismissed',
            params: ['thing']
        },
        {
            name: 'sent back',
            params: ['thing']
        },
        {
            name: 'pinged',
            params: ['pingEvent']
        },
        {
            name: 'ponged',
            params: ['pongEvent']
        },
        {
            name: 'comment created',
            params: ['comment']
        },
        {
            name: 'comment read by',
            params: ['comment']
        },
        {
            name: 'reconnected'
        }
    ]
}

module.exports = {
    name: 'event',
    actions: [
        {
            name: 'created',
            params: ['event']
        },
        {
            name: 'accepted',
            params: ['event']
        },
        {
            name: 'marked as done',
            params: ['event']
        },
        {
            name: 'closed',
            params: ['event']
        },
        {
            name: 'close acked',
            params: ['event']
        },
        {
            name: 'dismissed',
            params: ['event']
        },
        {
            name: 'sent back',
            params: ['event']
        },
        {
            name: 'pinged',
            params: ['event']
        },
        {
            name: 'ponged',
            params: ['event']
        },
        {
            name: 'unmuted',
            params: ['event']
        },
        {
            name: 'muted',
            params: ['event']
        },
        {
            name: 'follow up',
            params: ['event']
        },
        {
            name: 'unfollow',
            params: ['event']
        },
        {
            name: 'unassigned',
            params: ['event']
        },
        {
            name: 'comment created',
            params: ['event']
        },
        {
            name: 'comment read by',
            params: ['event']
        },
        {
            name: 'comment read by email',
            params: ['event']
        }
    ]
}

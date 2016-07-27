module.exports = {
    name: 'whats new',
    actions: [
        {
            name: 'fetchWhatsNew',
            type: 'get',
            path: '/api/things/whatsnew',
            completeParams: {
                notifications: 'result'
            }
        },
        {
            name: 'notification received',
            params: ['notification']
        },
        {
            name: 'notification deleted',
            params: ['notification']
        }
    ]
}
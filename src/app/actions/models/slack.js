module.exports = {
    name: 'slack',
    actions: [
        {
            name: 'fetch',
            type: 'get',
            path: '/api/slack',
            completeParams: {
                slack: 'result'
            }
        }
    ]
}

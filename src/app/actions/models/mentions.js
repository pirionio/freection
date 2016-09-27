module.exports = {
    name: 'mentions',
    actions: [
        {
            name: 'set state',
            params: ['things']
        },
        {
            name: 'fetchMentions',
            private: true,
            type: 'get',
            path: '/api/things/mentions',
            completeParams: {
                things: 'result'
            }
        }
    ]
}
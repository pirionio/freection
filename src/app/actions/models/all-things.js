module.exports = {
    name: 'all things',
    actions: [
        {
            name: 'set state',
            params: ['followUps']
        },
        {
            name: 'fetch all things',
            private: true,
            type: 'get',
            path: '/api/things/all',
            completeParams: {
                things: 'result'
            }
        }
    ]
}
module.exports = {
    name: 'thing page',
    actions: [
        {
            name: 'show thing page',
            private: true,
            params: ['thing']
        },
        {
            name: 'hide thing page',
            private: true
        },
        {
            name: 'get thing',
            private: true,
            type: 'get',
            path: '/api/things/${thingId}',
            params: ['thingId'],
            completeParams: {
                thing: 'result'
            }
        }
    ]
}
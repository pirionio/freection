module.exports = {
    name: 'thing page',
    actions: [
        {
            name: 'show',
            private: true,
            params: ['thing']
        },
        {
            name: 'hide',
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
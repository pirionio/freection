module.exports = {
    name: 'thing page',
    actions: [
        {
            name: 'show thing page',
            params: ['thing']
        },
        {
            name: 'hide thing page'
        },
        {
            name: 'get thing',
            type: 'get',
            path: '/api/things/${thingId}',
            params: ['thingId'],
            completeParams: {
                thing: 'result'
            }
        }
    ]
}
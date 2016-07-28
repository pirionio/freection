module.exports = {
    name: 'thing page',
    actions: [
        {
            name: 'show',
            params: ['thingId']
        },
        {
            name: 'hide'
        },
        {
            name: 'get',
            type: 'get',
            path: '/api/things/${thingId}',
            params: ['thingId'],
            completeParams: {
                thing: 'result'
            }
        }
    ]
}
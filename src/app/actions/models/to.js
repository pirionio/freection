module.exports = {
    name: 'to',
    actions: [
        {
            name: 'get',
            params: ['query', 'forCacheOnly'],
            type: 'get',
            path: '/api/contacts?query=${query}&max=6',
            completeParams: {
                contacts: 'result',
                query: 'query'
            }
        },
        {
            name: 'clear'
        },
        {
            name: 'getFromCache',
            params: ['query']
        }
    ]
}


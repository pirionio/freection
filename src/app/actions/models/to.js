module.exports = {
    name: 'to',
    actions: [
        {
            name: 'get',
            params: ['query'],
            type: 'get',
            path: '/api/contacts?query=${query}&max=6',
            completeParams: {
                contacts: 'result',
                query: 'query'
            }
        },
        {
            name: 'clear'
        }
    ]
}


module.exports = {
    name: 'to do',
    actions: [
        {
            name: 'set state',
            params: ['things']
        },
        {
            name: 'fetchToDo',
            private: true,
            type: 'get',
            path: '/api/things/do',
            completeParams: {
                things: 'result'
            }
        }
    ]
}
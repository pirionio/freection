module.exports = {
    name: 'to do',
    actions: [
        {
            name: 'fetchToDo',
            type: 'get',
            path: '/api/things/do',
            completeParams: {
                things: 'result'
            }
        }
    ]
}
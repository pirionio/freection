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
        },
        {
            name: 'reorder drag',
            params: ['movedItemId', 'onItemId']
        },
        {
            name: 'move to group',
            params: ['movedItemId', 'category']
        },
        {
            name: 'set todos',
            params: ['todos'],
            type: 'post',
            path: '/api/users/todos',
            body: {
                todos: 'todos'
            }
        }
    ]
}
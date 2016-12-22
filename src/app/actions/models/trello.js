module.exports = {
    name: 'trello',
    actions: [
        {
            name: 'fetch user info',
            type: 'get',
            path: '/api/trello',
            completeParams: {
                trello: 'result'
            }
        },
        {
            name: 'enable board',
            params: ['boardId'],
            type: 'post',
            path: '/api/trello/enableboard/${boardId}'
        },
        {
            name: 'disable board',
            params: ['boardId'],
            type: 'post',
            path: '/api/trello/disableboard/${boardId}'
        }
    ]
}

module.exports = {
    name: 'email page',
    actions: [
        {
            name: 'show email page',
            params: ['emailThread']
        },
        {
            name: 'hide email page'
        },
        {
            name: 'require update'
        },
        {
            name: 'get email',
            type: 'get',
            path: '/emails/api/${emailThreadId}',
            params: ['emailThreadId'],
            completeParams: {
                thread: 'result'
            }
        }
    ]
}
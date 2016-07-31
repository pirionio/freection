module.exports = {
    name: 'email page',
    actions: [
        {
            name: 'show',
            params: ['emailThreadId']
        },
        {
            name: 'hide'
        },
        {
            name: 'get',
            type: 'get',
            path: '/emails/api/${emailThreadId}',
            params: ['emailThreadId'],
            completeParams: {
                thread: 'result'
            }
        }
    ]
}
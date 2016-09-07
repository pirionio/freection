module.exports = {
    name: 'email page',
    actions: [
        {
            name: 'show email page',
            private: true,
            params: ['emailThread']
        },
        {
            name: 'hide email page',
            private: true,
        },
        {
            name: 'require update'
        },
        {
            name: 'get email',
            private: true,
            type: 'get',
            path: '/emails/api/${emailThreadId}',
            params: ['emailThreadId'],
            completeParams: {
                thread: 'result'
            }
        }
    ]
}
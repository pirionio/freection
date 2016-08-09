module.exports = {
    name: 'email',
    actions: [
        {
            name: 'fetchUnread',
            type: 'get',
            path: '/emails/api/unread',
            completeParams: {
                emails: 'result'
            }
        },
        {
            name: 'updateUnread',
            type: 'get',
            path: '/emails/api/unread',
            completeParams: {
                emails: 'result'
            }
        },
        {
            name: 'hello',
            type: 'post',
            path: '/emailssync/api/hello'
        },
        {
            name: 'invalidate',
        }
    ]
}
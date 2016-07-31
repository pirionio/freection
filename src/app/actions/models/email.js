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
        }
    ]
}
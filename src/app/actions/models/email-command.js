module.exports = {
    name: 'email-command',
    actions: [
        {
            name: 'mark as read',
            params: ['emailIds'],
            type: 'post',
            path: '/emails/api/markasread',
            body: {
                emailIds: 'emailIds'
            },
            completeParams: {
                emailIds: 'emailIds'
            }
        }
    ]
}
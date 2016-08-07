module.exports = {
    name: 'email-command',
    actions: [
        {
            name: 'new email',
            params: ['email'],
            type: 'post',
            path: '/api/new/email',
            body: {
                to: 'email.to',
                body: 'email.body',
                subject: 'email.subject'
            }
        },
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
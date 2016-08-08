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
            name: 'do email',
            params: ['threadId'],
            type: 'post',
            path: '/emails/api/${threadId}/do'
        },
        {
            name: 'mark as read',
            params: ['emailUids'],
            type: 'post',
            path: '/emails/api/markasread',
            body: {
                emailUids: 'emailUids'
            },
            completeParams: {
                emailUids: 'emailUids'
            }
        }
    ]
}
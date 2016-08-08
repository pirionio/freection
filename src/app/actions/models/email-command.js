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
            name: 'reply to all',
            params: ['threadId', 'messageText', 'subject', 'to', 'inReplyTo'],
            type: 'post',
            path: '/emails/api/message',
            body: {
                messageText: 'messageText',
                subject: 'subject',
                to: 'to',
                inReplyTo: 'inReplyTo'
            },
            completeParams: {
                threadId: 'threadId',
                message: 'result'
            }
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
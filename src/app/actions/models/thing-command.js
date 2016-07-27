module.exports = {
    name: 'thing command',
    actions: [
        {
            name: 'comment',
            params: ['thingId', 'commentText'],
            type: 'post',
            path: '/api/things/${thingId}/comment',
            body: {
                commentText: 'commentText'
            },
            completeParams: {
                thingId: 'thingId',
                comment: 'result'
            }
        },
        {
            name: 'new thing',
            params: ['thing'],
            type: 'post',
            path: '/api/new',
            body: {
                to: 'thing.to',
                body: 'thing.body',
                subject: 'thing.subject'
            }
        }
    ]
}

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
        }
    ]
}

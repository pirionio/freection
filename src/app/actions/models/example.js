module.exports = {
    name: 'example',
    actions: [
        {   name: 'custom thing',
            type: 'custom'
        },
        {
            name: 'comment read by',
            params: ['thing']
        },
        {
            name: 'doThing',
            params: ['thing'],
            type: 'post',
            path: '/:${thing.id}/do',
        },
        {
            name: 'comment',
            params: ['thing', 'comment'],
            type: 'post',
            path: '/${thing.id}/comment',
            body: {
                comment: 'comment'
            },
            completeParams: {
                comment: 'result'
            }
        },
        {
            name: 'newThing',
            params: ['thing'],
            type: 'post',
            path: '/new',
            body: {
                subject: 'thing.subject'
            }
        },
        {
            name: 'getTodo',
            type: 'get',
            path: '/do',
            completeParams: {
                things: 'results'
            }
        }
    ]
}
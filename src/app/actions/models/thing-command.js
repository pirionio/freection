module.exports = {
    name: 'thing command',
    requires: {
        'EventTypes' : '../../../common/enums/event-types'
    },
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
        },
        {
            name: 'ping',
            params: ['thing'],
            type: 'post',
            path: '/api/things/${thing.id}/ping',
            completeParams: {
                thing: 'thing',
                pingEvent: 'result'
            }
        },
        {
            name: 'mark comment as read',
            params: ['comment'],
            type: 'post',
            path: '/api/things/${comment.id}/markcommentasread'
        },
        {
            name: 'doThing',
            params: ['thing'],
            type: 'post',
            path: '/api/things/${thing.id}/do'
        },
        {
            name: 'abort',
            params: ['thing'],
            type: 'post',
            path: '/api/things/${thing.id}/abort'
        },
        {
            name: 'close',
            params: ['thing'],
            type: 'post',
            path: '/api/things/${thing.id}/close'
        },
        {
            name: 'dismiss',
            params: ['thing'],
            type: 'post',
            path: '/api/things/${thing.id}/dismiss'
        },
        {
            name: 'mark as done',
            params: ['thing'],
            type: 'post',
            path: '/api/things/${thing.id}/done'
        },
        {
            name: 'discard comments',
            params: ['notification', 'user'],
            type: 'post',
            path: '/api/things/${notification.thing.id}/discard/${EventTypes.COMMENT.key}'
        },
        {
            name: 'discard ping',
            params: ['notification', 'user'],
            type: 'post',
            path: '/api/events/${notification.id}/discard'
        }
    ]
}

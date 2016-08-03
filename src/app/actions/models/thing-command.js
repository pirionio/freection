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
            path: '/api/events/${comment.id}/markasread'
        },
        {
            name: 'doThing',
            params: ['thing'],
            type: 'post',
            path: '/api/things/${thing.type.key}/${thing.id}/do'
        },
        {
            name: 'cancel',
            params: ['thing'],
            type: 'post',
            path: '/api/things/${thing.id}/cancel'
        },
        {
            name: 'cancel ack',
            params: ['thing'],
            type: 'post',
            path: '/api/things/${thing.id}/cancelack'
        },
        {
            name: 'close',
            params: ['thing'],
            type: 'post',
            path: '/api/things/${thing.type.key}/${thing.id}/close'
        },
        {
            name: 'dismiss',
            params: ['thing'],
            type: 'post',
            path: '/api/things/${thing.type.key}/${thing.id}/dismiss'
        },
        {
            name: 'mark as done',
            params: ['thing'],
            type: 'post',
            path: '/api/things/${thing.id}/done'
        },
        {
            name: 'discard comments',
            params: ['notification'],
            type: 'post',
            path: '/api/things/${notification.thing.id}/discard/${EventTypes.COMMENT.key}'
        },
        {
            name: 'discard ping',
            params: ['notification'],
            type: 'post',
            path: '/api/events/${notification.id}/discard'
        },
        {
            name: 'send back',
            params: ['thing'],
            type: 'post',
            path: '/api/things/${thing.id}/sendback'
        }
    ]
}

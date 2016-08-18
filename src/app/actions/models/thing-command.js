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
            path: '/api/new/thing',
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
            name: 'pong',
            params: ['thing', 'messageText'],
            type: 'post',
            path: '/api/things/${thing.id}/pong',
            body: {
                messageText: 'messageText'
            },
            completeParams: {
                thing: 'thing'
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
            name: 'close ack',
            params: ['thing'],
            type: 'post',
            path: '/api/things/${thing.id}/closeack'
        },
        {
            name: 'close',
            params: ['thing', 'messageText'],
            type: 'post',
            path: '/api/things/${thing.type.key}/${thing.id}/close',
            body: {
                messageText: 'messageText'
            }
        },
        {
            name: 'dismiss',
            params: ['thing', 'messageText'],
            type: 'post',
            path: '/api/things/${thing.type.key}/${thing.id}/dismiss',
            body: {
                messageText: 'messageText'
            }
        },
        {
            name: 'mark as done',
            params: ['thing', 'messageText'],
            type: 'post',
            path: '/api/things/${thing.id}/done',
            body: {
                messageText: 'messageText'
            }
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
            name: 'discard pong',
            params: ['notification'],
            type: 'post',
            path: '/api/events/${notification.id}/discard'
        },
        {
            name: 'send back',
            params: ['thing', 'messageText'],
            type: 'post',
            path: '/api/things/${thing.id}/sendback',
            body: {
                messageText: 'messageText'
            }
        }
    ]
}

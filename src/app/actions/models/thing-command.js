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
                event: 'result'
            },
            track: 'comment',
            private: true
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
            },
            track: 'newThing'
        },
        {
            name: 'ping',
            params: ['thing'],
            type: 'post',
            path: '/api/things/${thing.id}/ping',
            completeParams: {
                thing: 'thing',
                event: 'result'
            },
            track: 'ping'
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
            },
            track: 'pong'
        },
        {
            name: 'mark comment as read',
            params: ['comment', 'updateInitialIsRead'],
            type: 'post',
            path: '/api/events/${comment.id}/markasread',
            completeParams: {
                event: 'comment',
                updateInitialIsRead: 'updateInitialIsRead'
            }
        },
        {
            name: 'doThing',
            params: ['thing'],
            type: 'post',
            path: '/api/things/${thing.type.key}/${thing.id}/do',
            track: 'doThing'
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
            },
            track: 'close'
        },
        {
            name: 'dismiss',
            params: ['thing', 'messageText'],
            type: 'post',
            path: '/api/things/${thing.type.key}/${thing.id}/dismiss',
            body: {
                messageText: 'messageText'
            },
            track: 'dismiss'
        },
        {
            name: 'mark as done',
            params: ['thing', 'messageText'],
            type: 'post',
            path: '/api/things/${thing.id}/done',
            body: {
                messageText: 'messageText'
            },
            track: 'done'
        },
        {
            name: 'discard comments',
            params: ['notification'],
            type: 'post',
            path: '/api/things/${notification.thing.id}/discard/${EventTypes.COMMENT.key}',
            track: 'discard'
        },
        {
            name: 'discard single notification',
            params: ['notification'],
            type: 'post',
            path: '/api/events/${notification.id}/discard',
            track: 'discard'
        },
        { 
            name: 'join mention',
            params: ['thing'],
            type: 'post',
            path: '/api/things/${thing.id}/joinmention',
            completeParams: {
                thing: 'result'
            },
            track: 'join'
        },
        {
            name: 'leave mention',
            params: ['thing'],
            type: 'post',
            path: '/api/things/${thing.id}/leavemention',
            completeParams: {
                thing: 'result'
            },
            track: 'leave'
        },
        {
            name: 'send back',
            params: ['thing', 'messageText'],
            type: 'post',
            path: '/api/things/${thing.id}/sendback',
            body: {
                messageText: 'messageText'
            },
            track: 'sendback'
        },
        {
            name: 'follow up',
            params: ['thing'],
            type: 'post',
            path: '/api/things/${thing.id}/followup',
            track: 'followup'
        },
        {
            name: 'unfollow',
            params: ['thing'],
            type: 'post',
            path: '/api/things/${thing.id}/unfollow',
            track: 'unfollow'
        }
    ]
}

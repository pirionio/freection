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
                thing: 'result'
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
                body: 'thing.body'
            },
            track: 'newThing'
        },
        {
            name: 'ping',
            params: ['thing'],
            type: 'post',
            path: '/api/things/${thing.id}/ping',
            completeParams: {
                thing: 'result'
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
            name: 'cancel',
            params: ['thing', 'messageText'],
            type: 'post',
            path: '/api/things/${thing.type.key}/${thing.id}/close',
            body: {
                messageText: 'messageText'
            },
            completeParams: {
                thing: 'thing',
                event: 'result'
            },
            track: 'close',
            private: true
        },
        {
            name: 'close',
            params: ['thing', 'messageText'],
            type: 'post',
            path: '/api/things/${thing.type.key}/${thing.id}/close',
            body: {
                messageText: 'messageText'
            },
            completeParams: {
                thing: 'thing',
                event: 'result'
            },
            track: 'close',
            private: true
        },
        {
            name: 'dismiss',
            params: ['thing', 'messageText'],
            type: 'post',
            path: '/api/things/${thing.type.key}/${thing.id}/dismiss',
            body: {
                messageText: 'messageText'
            },
            completeParams: {
                thing: 'result',
                messageText: 'messageText'
            },
            track: 'dismiss',
            private: true
        },
        {
            name: 'mark as done',
            params: ['thing', 'messageText'],
            type: 'post',
            path: '/api/things/${thing.type.key}/${thing.id}/done',
            body: {
                messageText: 'messageText'
            },
            completeParams: {
                thing: 'result'
            },
            track: 'done',
            private: true
        },
        {
            name: 'discard comments',
            params: ['notification'],
            type: 'post',
            path: '/api/things/${notification.thing.id}/discardComments',
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
            name: 'unmute',
            params: ['thing'],
            type: 'post',
            path: '/api/things/${thing.id}/unmute',
            completeParams: {
                thing: 'result'
            },
            track: 'unmute'
        },
        {
            name: 'mute',
            params: ['thing'],
            type: 'post',
            path: '/api/things/${thing.id}/mute',
            completeParams: {
                thing: 'result'
            },
            track: 'mute'
        },
        {
            name: 'send back',
            params: ['thing', 'messageText'],
            type: 'post',
            path: '/api/things/${thing.id}/sendback',
            body: {
                messageText: 'messageText'
            },
            completeParams: {
                thing: 'thing',
                event: 'result'
            },
            track: 'sendback',
            private: true
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
        },
        {
            name: 'closed_unfollow',
            params: ['thing'],
            type: 'post',
            path: '/api/things/${thing.id}/unfollow',
            track: 'unfollow'
        }
    ]
}

const router = require('express').Router()

const ThingService = require('../../shared/application/thing-service')
const EventService = require('../../shared/application/event-service')
const EndpointUtil = require('../../shared/utils/endpoint-util')

router.get('/whatsnew', function(request, response) {
    EndpointUtil.handleGet(request, response, ThingService.getWhatsNew, {
        type: 'What\'s New'
    })
})

router.get('/do', function(request, response) {
    EndpointUtil.handleGet(request, response, ThingService.getToDo, {
        type: 'To Dos'
    })
})

router.get('/followups', function(request, response) {
    EndpointUtil.handleGet(request, response, ThingService.getFollowUps, {
        type: 'Follow Ups'
    })
})

router.get('/:thingId', function(request, response) {
    EndpointUtil.handleGet(request, response, ThingService.getThing, {
        type: 'thing',
        params: ['thingId']
    })
})

router.post('/:thingId/do', function(request, response) {
    EndpointUtil.handlePost(request, response, ThingService.doThing, {
        params: ['thingId'],
        result: false,
        errorTemplates: {
            notFound: getNotFoundErrorTemplate(),
            general: 'Could not save user ${user} as a doer of thing ${thingId}'
        }
    })
})

router.post('/:thingId/dismiss', function(request, response) {
    EndpointUtil.handlePost(request, response, ThingService.dismiss, {
        params: ['thingId'],
        result: false,
        errorTemplates: {
            notFound: getNotFoundErrorTemplate(),
            general: 'Could not dismiss thing ${thingId} by user user ${user}'
        }
    })
})

router.post('/:thingId/done', function(request, response) {
    EndpointUtil.handlePost(request, response, ThingService.markAsDone, {
        params: ['thingId'],
        result: false,
        errorTemplates: {
            notFound: getNotFoundErrorTemplate(),
            general: 'Could not mark thing ${thingId} as done by user user ${user}'
        }
    })
})

router.post('/:thingId/close', function(request, response) {
    EndpointUtil.handlePost(request, response, ThingService.close, {
        params: ['thingId'],
        result: false,
        errorTemplates: {
            notFound: getNotFoundErrorTemplate(),
            general: 'Could not close thing ${thingId} by user user ${user}'
        }
    })
})

router.post('/:thingId/abort', function(request, response) {
    EndpointUtil.handlePost(request, response, ThingService.abort, {
        params: ['thingId'],
        result: false,
        errorTemplates: {
            notFound: getNotFoundErrorTemplate(),
            general: 'Could not abort thing ${thingId} by user user ${user}'
        }
    })
})

router.post('/:thingId/sendback', function(request, response) {
    EndpointUtil.handlePost(request, response, ThingService.sendBack, {
        params: ['thingId'],
        result: false,
        errorTemplates: {
            notFound: getNotFoundErrorTemplate(),
            general: 'Could not send back thing ${thingId} by user user ${user}'
        }
    })
})

router.post('/:thingId/ping', function(request, response) {
    EndpointUtil.handlePost(request, response, ThingService.ping, {
        params: ['thingId'],
        result: true,
        errorTemplates: {
            notFound: getNotFoundErrorTemplate(),
            general: 'Could not ping thing ${thingId} by user user ${user}'
        }
    })
})

router.post('/:thingId/comment', function(request, response) {
    EndpointUtil.handlePost(request, response, ThingService.comment, {
        params: ['thingId'],
        body: ['commentText'],
        result: true,
        errorTemplates: {
            notFound: getNotFoundErrorTemplate(),
            general: 'Could not comment on thing ${thingId} by user ${user}'
        }
    })
})

router.post('/:thingId/discard/:eventType', function(request, response) {
    EndpointUtil.handlePost(request, response, ThingService.discardEventsByType, {
        params: ['thingId', 'eventType'],
        result: false,
        errorTemplates: {
            notFound: getNotFoundErrorTemplate(),
            general: 'Could not discard events of type ${eventType} unread by user ${user} for thing ${thingId}'
        }
    })
})

function getNotFoundErrorTemplate() {
    return 'Could not find thing ${thingId}'
}

module.exports = router
const router = require('express').Router()

const ThingService = require('../../shared/application/thing-service')
const GithubThingService = require('../../shared/application/github-thing-service')
const EventService = require('../../shared/application/event-service')
const EndpointUtil = require('../../shared/utils/endpoint-util')
const EntityTypes = require('../../../common/enums/entity-types')

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

router.post('/:type/:thingId/do', function(request, response) {
    EndpointUtil.handlePost(request, response, getServiceByType(request).doThing, {
        params: ['thingId'],
        result: false,
        errorTemplates: {
            notFound: getNotFoundErrorTemplate(),
            IllegalOperation: getIllegalOperationErrorTemplate(),
            general: 'Could not save user ${user} as a doer of thing ${thingId}'
        }
    })
})

router.post('/:type/:thingId/dismiss', function(request, response) {
    EndpointUtil.handlePost(request, response, getServiceByType(request).dismiss, {
        params: ['thingId'],
        body: ['messageText'],
        result: false,
        errorTemplates: {
            notFound: getNotFoundErrorTemplate(),
            IllegalOperation: getIllegalOperationErrorTemplate(),
            general: 'Could not dismiss thing ${thingId} by user user ${user}'
        }
    })
})

router.post('/:thingId/done', function(request, response) {
    EndpointUtil.handlePost(request, response, ThingService.markAsDone, {
        params: ['thingId'],
        body: ['messageText'],
        result: false,
        errorTemplates: {
            notFound: getNotFoundErrorTemplate(),
            IllegalOperation: getIllegalOperationErrorTemplate(),
            general: 'Could not mark thing ${thingId} as done by user user ${user}'
        }
    })
})

router.post('/:type/:thingId/close', function(request, response) {
    EndpointUtil.handlePost(request, response, getServiceByType(request).close, {
        params: ['thingId'],
        body: ['messageText'],
        result: false,
        errorTemplates: {
            notFound: getNotFoundErrorTemplate(),
            IllegalOperation: getIllegalOperationErrorTemplate(),
            general: 'Could not close thing ${thingId} by user user ${user}'
        }
    })
})

router.post('/:thingId/cancelack', function(request, response) {
    EndpointUtil.handlePost(request, response, ThingService.cancelAck, {
        params: ['thingId'],
        result: false,
        errorTemplates: {
            notFound: getNotFoundErrorTemplate(),
            general: 'Could not accept cancellation of thing ${thingId} by user user ${user}'
        }
    })
})

router.post('/:thingId/sendback', function(request, response) {
    EndpointUtil.handlePost(request, response, ThingService.sendBack, {
        params: ['thingId'],
        body: ['messageText'],
        result: false,
        errorTemplates: {
            notFound: getNotFoundErrorTemplate(),
            IllegalOperation: getIllegalOperationErrorTemplate(),
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
            IllegalOperation: getIllegalOperationErrorTemplate(),
            general: 'Could not ping thing ${thingId} by user user ${user}'
        }
    })
})

router.post('/:thingId/pong', function(request, response) {
    EndpointUtil.handlePost(request, response, ThingService.pong, {
        params: ['thingId'],
        body: ['messageText'],
        result: false,
        errorTemplates: {
            notFound: getNotFoundErrorTemplate(),
            IllegalOperation: getIllegalOperationErrorTemplate(),
            general: 'Could not pong thing ${thingId} by user user ${user}'
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

function getIllegalOperationErrorTemplate() {
    return 'Illegal operation on thing ${thingId}'
}

function getNotFoundErrorTemplate() {
    return 'Could not find thing ${thingId}'
}

function getServiceByType(request) {
    const type = request.params.type.toUpperCase()

    if (type === EntityTypes.GITHUB.key)
        return GithubThingService
    else
        return ThingService
}

module.exports = router
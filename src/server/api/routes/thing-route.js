import {Router} from 'express'

import * as ThingService from '../../shared/application/thing-service'
import * as GithubThingService from '../../shared/application/github-thing-service'
import * as SlackThingService from '../../shared/application/slack-thing-service'
import * as EndpointUtil from '../../shared/utils/endpoint-util'
import EntityTypes from '../../../common/enums/entity-types'

const router = Router()

router.get('/whatsnew', (request, response) => {
    EndpointUtil.handleGet(request, response, ThingService.getWhatsNew, {
        type: 'What\'s New'
    })
})

router.get('/do', (request, response) => {
    EndpointUtil.handleGet(request, response, ThingService.getToDo, {
        type: 'To Dos'
    })
})

router.get('/followups', (request, response) => {
    EndpointUtil.handleGet(request, response, ThingService.getFollowUps, {
        type: 'Follow Ups'
    })
})

router.get('/emailthings', (request, response) => {
    EndpointUtil.handleGet(request, response, ThingService.getEmailThings, {
        type: 'Email Things'
    })
})

router.get('/mentions', (request, response) => {
    EndpointUtil.handleGet(request, response, ThingService.getUserMentionedThings, {
        type: 'Mentions'
    })
})

router.get('/:thingId', (request, response) => {
    EndpointUtil.handleGet(request, response, ThingService.getThing, {
        type: 'thing',
        params: ['thingId']
    })
})

router.post('/:type/:thingId/do', (request, response) => {
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

router.post('/:type/:thingId/dismiss', (request, response) => {
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

router.post('/:thingId/done', (request, response) => {
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

router.post('/:type/:thingId/close', (request, response) => {
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

router.post('/:thingId/closeack', (request, response) => {
    EndpointUtil.handlePost(request, response, ThingService.closeAck, {
        params: ['thingId'],
        result: false,
        errorTemplates: {
            notFound: getNotFoundErrorTemplate(),
            general: 'Could not accept close of thing ${thingId} by user user ${user}'
        }
    })
})

router.post('/:thingId/sendback', (request, response) => {
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

router.post('/:thingId/ping', (request, response) => {
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

router.post('/:thingId/pong', (request, response) => {
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

router.post('/:thingId/comment', (request, response) => {
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

router.post('/:thingId/discard/:eventType', (request, response) => {
    EndpointUtil.handlePost(request, response, ThingService.discardEventsByType, {
        params: ['thingId', 'eventType'],
        result: false,
        errorTemplates: {
            notFound: getNotFoundErrorTemplate(),
            general: 'Could not discard events of type ${eventType} unread by user ${user} for thing ${thingId}'
        }
    })
})

router.post('/:thingId/joinmention', (request, response) => {
    EndpointUtil.handlePost(request, response, ThingService.joinMention, {
        params: ['thingId'],
        result: true,
        errorTemplates: {
            notFound: getNotFoundErrorTemplate(),
            general: 'Could not join to mention for user ${user} for thing ${thingId}'
        }
    })
})

router.post('/:thingId/leavemention', (request, response) => {
    EndpointUtil.handlePost(request, response, ThingService.leaveMention, {
        params: ['thingId'],
        result: true,
        errorTemplates: {
            notFound: getNotFoundErrorTemplate(),
            general: 'Could not leave mention for user ${user} for thing ${thingId}'
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

    if (type === EntityTypes.SLACK.key)
        return SlackThingService

    return ThingService
}

export default router
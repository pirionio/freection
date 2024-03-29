import {Router} from 'express'

import * as ThingService from '../../shared/application/thing-service'
import * as ExternalThingService from '../../shared/application/external-thing-service'
import * as EndpointUtil from '../../shared/utils/endpoint-util'
import EntityTypes from '../../../common/enums/entity-types'
import {thingToDto} from '../../shared/application/transformers'

const router = Router()

router.get('/all', (request, response) => {
    EndpointUtil.handleGet(request, response, ThingService.getAllThings, {
        type: 'All Items'
    })
})

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
        type: 'Email Tasks'
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
            illegalOperation: getIllegalOperationErrorTemplate(),
            general: 'Could not save user ${user} as a doer of thing ${thingId}'
        }
    })
})

router.post('/:type/:thingId/dismiss', (request, response) => {
    EndpointUtil.handlePost(request, response, getServiceByType(request).dismiss, {
        params: ['thingId'],
        body: ['messageText'],
        result: true,
        transform: thingToDto,
        errorTemplates: {
            notFound: getNotFoundErrorTemplate(),
            illegalOperation: getIllegalOperationErrorTemplate(),
            general: 'Could not dismiss task ${thingId} by user user ${user}'
        }
    })
})

router.post('/:thingId/done', (request, response) => {
    const markAsDone = (user, thingId, text) => {
        return ThingService.markAsDone(user, thingId, {text})
    }

    EndpointUtil.handlePost(request, response, markAsDone, {
        params: ['thingId'],
        body: ['messageText'],
        result: true,
        transform: thingToDto,
        errorTemplates: {
            notFound: getNotFoundErrorTemplate(),
            illegalOperation: getIllegalOperationErrorTemplate(),
            general: 'Could not mark task ${thingId} as done by user user ${user}'
        }
    })
})

router.post('/:type/:thingId/done', (request, response) => {
    const markAsDone = (user, thingId, text) => {
        return getServiceByType(request).markAsDone(user, thingId, {text})
    }

    EndpointUtil.handlePost(request, response, markAsDone, {
        params: ['thingId'],
        body: ['messageText'],
        result: true,
        transform: thingToDto,
        errorTemplates: {
            notFound: getNotFoundErrorTemplate(),
            illegalOperation: getIllegalOperationErrorTemplate(),
            general: 'Could not mark task ${thingId} as done by user user ${user}'
        }
    })
})

router.post('/:type/:thingId/close', (request, response) => {
    EndpointUtil.handlePost(request, response, getServiceByType(request).close, {
        params: ['thingId'],
        body: ['messageText'],
        result: true,
        transform: thingToDto,
        errorTemplates: {
            notFound: getNotFoundErrorTemplate(),
            illegalOperation: getIllegalOperationErrorTemplate(),
            general: 'Could not close task ${thingId} by user user ${user}'
        }
    })
})

router.post('/:thingId/closeack', (request, response) => {
    EndpointUtil.handlePost(request, response, ThingService.closeAck, {
        params: ['thingId'],
        result: false,
        errorTemplates: {
            notFound: getNotFoundErrorTemplate(),
            general: 'Could not accept close of task ${thingId} by user user ${user}'
        }
    })
})

router.post('/:thingId/sendback', (request, response) => {
    EndpointUtil.handlePost(request, response, ThingService.sendBack, {
        params: ['thingId'],
        body: ['messageText'],
        result: true,
        transform: thingToDto,
        errorTemplates: {
            notFound: getNotFoundErrorTemplate(),
            illegalOperation: getIllegalOperationErrorTemplate(),
            general: 'Could not send back task ${thingId} by user user ${user}'
        }
    })
})

router.post('/:thingId/ping', (request, response) => {
    EndpointUtil.handlePost(request, response, ThingService.ping, {
        params: ['thingId'],
        result: true,
        transform: thingToDto,
        errorTemplates: {
            notFound: getNotFoundErrorTemplate(),
            illegalOperation: getIllegalOperationErrorTemplate(),
            general: 'Could not ping task ${thingId} by user user ${user}'
        }
    })
})

router.post('/:thingId/pong', (request, response) => {
    EndpointUtil.handlePost(request, response, ThingService.pong, {
        params: ['thingId'],
        body: ['messageText'],
        result: false,
        transform: thingToDto,
        errorTemplates: {
            notFound: getNotFoundErrorTemplate(),
            illegalOperation: getIllegalOperationErrorTemplate(),
            general: 'Could not pong task ${thingId} by user user ${user}'
        }
    })
})

router.post('/:thingId/comment', (request, response) => {
    const comment = (user, thingId, text) => {
        return ThingService.comment(user, thingId, {text})
    }
    
    EndpointUtil.handlePost(request, response, comment, {
        params: ['thingId'],
        body: ['commentText'],
        result: true,
        transform: thingToDto,
        errorTemplates: {
            notFound: getNotFoundErrorTemplate(),
            general: 'Could not comment on task ${thingId} by user ${user}'
        }
    })
})

router.post('/:thingId/discardComments', (request, response) => {
    EndpointUtil.handlePost(request, response, ThingService.discardComments, {
        params: ['thingId'],
        result: false,
        errorTemplates: {
            notFound: getNotFoundErrorTemplate(),
            general: 'Could not discard comments unread by user ${user} for task ${thingId}'
        }
    })
})

router.post('/:thingId/followup', (request, response) => {
    EndpointUtil.handlePost(request, response, ThingService.followUp, {
        params: ['thingId'],
        result: true,
        errorTemplates: {
            notFound: getNotFoundErrorTemplate(),
            general: 'Could not follow up task ${thingId} for user ${user}'
        }
    })
})

router.post('/:thingId/unfollow', (request, response) => {
    EndpointUtil.handlePost(request, response, ThingService.unfollow, {
        params: ['thingId'],
        result: true,
        errorTemplates: {
            notFound: getNotFoundErrorTemplate(),
            general: 'Could not stop following up task ${thingId} for user ${user}'
        }
    })
})

router.post('/:thingId/unmute', (request, response) => {
    EndpointUtil.handlePost(request, response, ThingService.unmute, {
        params: ['thingId'],
        result: true,
        errorTemplates: {
            notFound: getNotFoundErrorTemplate(),
            general: 'Could not unmute a task for user ${user} for thing ${thingId}'
        }
    })
})

router.post('/:thingId/mute', (request, response) => {
    EndpointUtil.handlePost(request, response, ThingService.mute, {
        params: ['thingId'],
        result: true,
        errorTemplates: {
            notFound: getNotFoundErrorTemplate(),
            general: 'Could not mute a task for user ${user} for thing ${thingId}'
        }
    })
})

function getIllegalOperationErrorTemplate() {
    return 'Illegal operation on task ${thingId}'
}

function getNotFoundErrorTemplate() {
    return 'Could not find task ${thingId}'
}

function getServiceByType(request) {
    const type = request.params.type.toUpperCase()

    if ([EntityTypes.GITHUB.key,EntityTypes.EXTERNAL.key].includes(type))
        return ExternalThingService

    return ThingService
}

export default router
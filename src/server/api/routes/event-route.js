import {Router} from 'express'
import * as EventService from '../../shared/application/event-service'
import * as EndpointUtil from '../../shared/utils/endpoint-util'

const router = Router()

router.post('/:eventId/discard', (request, response) => {
    EndpointUtil.handlePost(request, response, EventService.discard, {
        params: ['eventId'],
        result: false,
        errorTemplates: {
            notFound: getNotFoundErrorTemplate(),
            general: 'Could not discard event <%=eventId%> unread by user <%=user%>'
        }
    })
})

router.post('/:eventId/markasread', (request, response) => {
    EndpointUtil.handlePost(request, response, EventService.markAsRead, {
        params: ['eventId'],
        result: true,
        errorTemplates: {
            notFound: getNotFoundErrorTemplate(),
            general: 'Could not mark event <%=eventId%> as read by user <%=user%>'
        }
    })
})

function getNotFoundErrorTemplate() {
    return 'Could not find event ${eventId}'
}

export default router
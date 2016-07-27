const router = require('express').Router()

const EventService = require('../../shared/application/event-service')
const EndpointUtil = require('../../shared/utils/endpoint-util')

router.post('/:eventId/discard', function(request, response) {
    EndpointUtil.handlePost(request, response, EventService.discardById, {
        params: ['eventId'],
        result: false,
        errorTemplates: {
            notFound: getNotFoundErrorTemplate(),
            general: 'Could not discard event <%=eventId%> unread by user <%=user%>'
        }
    })
})

router.post('/:eventId/markasread', function(request, response) {
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

module.exports = router
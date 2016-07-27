const router = require('express').Router()

const EventService = require('../../shared/application/event-service')
const logger = require('../../shared/utils/logger')

router.post('/:eventId/discard', function(request, response) {
    const user = request.user
    const {eventId} = request.params

    EventService.discardById(user, eventId)
        .then(() => response.json({}))
        .catch(error => {
            if (error && error.name === 'DocumentNotFoundError') {
                response.status(404).send(`Could not find Event with ID ${eventId}`)
            } else {
                response.status(500).send(`Could not discard event ${eventId} unread by user ${user.email}: ${error.message}`)
            }
        })
})

module.exports = router
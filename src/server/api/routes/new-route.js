const router = require('express').Router()

const EndpointUtil = require('../../shared/utils/endpoint-util')
const ThingService = require('../../shared/application/thing-service')
const logger = require('../../shared/utils/logger')

router.post('/', function(request, response) {
    const {to, body, subject} = request.body
    const {user} = request

    if (!to) {
        response.status(400).send("to field is missing")
        return
    }

    if (!subject) {
        response.status(400).send("subject field is missing")
        return
    }

    EndpointUtil.handlePost(request, response, ThingService.newThing, {
        body: ['to', 'body', 'subject'],
        result: false,
        errorTemplates: {
            general: 'Could not create new thing by user ${user}'
        }
    })
})

module.exports = router
const router = require('express').Router()

const EndpointUtil = require('../../shared/utils/endpoint-util')
const ThingService = require('../../shared/application/thing-service')
const EmailService = require('../../shared/application/email-service')
const logger = require('../../shared/utils/logger')
const NewMessageTypes = require('../../../common/enums/new-message-types')

router.post('/', function(request, response) {
    const {to, body, subject, selectedOption} = request.body
    const {user} = request

    if (!to) {
        response.status(400).send("to field is missing")
        return
    }

    if (!subject) {
        response.status(400).send("subject field is missing")
        return
    }

    const action = selectedOption === NewMessageTypes.THING ? ThingService.newThing : EmailService.sendEmail

    EndpointUtil.handlePost(request, response, action, {
        body: ['to', 'body', 'subject'],
        result: false,
        errorTemplates: {
            general: selectedOption === NewMessageTypes.THING ?
                'Could not create new thing by user ${user}' :
                'Could not send new email by user ${user}'
        }
    })
})

module.exports = router
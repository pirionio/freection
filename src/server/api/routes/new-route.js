const router = require('express').Router()

const EndpointUtil = require('../../shared/utils/endpoint-util')
const ThingService = require('../../shared/application/thing-service')
const EmailService = require('../../shared/application/email-service')
const logger = require('../../shared/utils/logger')

router.post('/thing', function(request, response) {
    if (!isValid(request, response)) {
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

router.post('/email', function(request, response) {
    if (!isValid(request, response)) {
        return
    }

    EndpointUtil.handlePost(request, response, EmailService.sendEmail, {
        body: ['to', 'body', 'subject'],
        result: false,
        errorTemplates: {
            general: 'Could not send new email by user ${user}'
        }
    })
})

function isValid(request, response) {
    const {to, subject} = request.body

    if (!to) {
        response.status(400).send("to field is missing")
        return false
    }

    if (!subject) {
        response.status(400).send("subject field is missing")
        return false
    }

    return true
}

module.exports = router
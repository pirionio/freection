const router = require('express').Router()
const AddressParser = require('email-addresses')

const EndpointUtil = require('../../shared/utils/endpoint-util')
const ThingService = require('../../shared/application/thing-service')
const EmailService = require('../../shared/application/email-service')
const logger = require('../../shared/utils/logger')

router.post('/thing', function(request, response) {
    if (!isValid(request, response)) {
        return
    }

    EndpointUtil.handlePost(request, response, ThingService.newThing, {
        body: ['to', 'subject', 'body'],
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
        body: ['to', 'subject', 'body'],
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

    if (!validateEmailAddress(to)) {
        response.status(400).send('Invalid address')
    }

    return true
}

function validateEmailAddress(email) {
    const emailAddress = AddressParser.parseOneAddress(email)
    return !!emailAddress
}

module.exports = router
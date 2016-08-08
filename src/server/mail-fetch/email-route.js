const router = require('express').Router()

const EndpointUtil = require('../shared/utils/endpoint-util')
const EmailService = require('../shared/application/email-service')
const logger = require('../shared/utils/logger')

router.get('/unread', (request, response) => {
    EndpointUtil.handleGet(request, response, EmailService.fetchUnreadMessages, {
        type: 'Unread Emails'
    })
})

router.get('/:emailThreadId', (request, response) => {
    EndpointUtil.handlePost(request, response, EmailService.fetchFullThread, {
        params: ['emailThreadId'],
        result: true,
        errorTemplates: {
            general: 'Error while fetching thread ${emailThreadId}'
        }
    })
})

router.post('/:emailThreadId/do', (request, response) => {
    EndpointUtil.handlePost(request, response, EmailService.doEmail, {
        params: ['emailThreadId'],
        result: false,
        errorTemplates: {
            general: 'Error while doing thread ${emailThreadId}'
        }
    })
})

router.post('/message', (request, response) => {
    EndpointUtil.handlePost(request, response, EmailService.replyToAll, {
        body: ['to', 'inReplyTo', 'subject', 'messageText'],
        result: true,
        errorTemplates: {
            general: 'Could not reply-to-all for message ${inReplyTo}'
        }
    })
})

router.post('/markasread', (request, response) => {
    EndpointUtil.handlePost(request, response, EmailService.markAsRead, {
        body: ['emailUids'],
        result: false,
        errorTemplates: {
            general: 'Error while marking emails as read'
        }
    })
})

module.exports = router
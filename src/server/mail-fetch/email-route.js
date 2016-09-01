const router = require('express').Router()

import * as EndpointUtil from '../shared/utils/endpoint-util'
import * as EmailService from '../shared/application/email-service'

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
        body: ['to', 'inReplyTo', 'references', 'subject', 'messageText'],
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
const router = require('express').Router()

const EmailPushService = require('../shared/technical/email-push-service')
const logger = require('../shared/utils/logger')

router.post('/hello', (request, response) => {
    EmailPushService.hello(request.user)
        .then(() => response.json())
        .catch(error => {
            logger.info(`error thrown when trying to open push imap connection for ${request.user.email}`, error)
            response.status(500).send('error thrown when try to initiate push for user')
        })
})

router.post('/keepalive', (request, response) => {
    try {
        EmailPushService.keepAlive(request.user)
        response.json({})
    } catch(error) {
        if (error === 'NoConnection') {
            logger.info(`Keepalive fialed for ${request.user.email}, should call hello`)
            response.status(404).send('Connection is dead, please say hello again')
        } else {
            logger.info(`error thrown when doing keepalive for ${request.user.email}`, error)
            response.status(500).send('error while doing keepalive')
        }
    }
})

module.exports = router
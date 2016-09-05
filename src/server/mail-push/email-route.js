import * as  EmailPushService from '../shared/technical/email-push-service'
import {Router} from 'express'
import logger from '../shared/utils/logger'

const router = Router()

router.post('/hello', (request, response) => {
    EmailPushService.hello(request.user)
        .then(() => response.json({}))
        .catch(error => {
            logger.info(`mail-push - hello - error thrown when trying to open push IMAP connection for ${request.user.email}`, error)
            response.status(500).send('error thrown when try to initiate push for user')
        })
})

router.post('/keepalive', (request, response) => {
    try {
        EmailPushService.keepAlive(request.user)
        response.json({})
    } catch(error) {
        if (error === 'NoConnection') {
            logger.info(`mail-push - keepalive - failed for ${request.user.email}, should call hello`)
            response.status(404).send('Connection is dead, please say hello again')
        } else {
            logger.info(`mail-push - keepalive - error thrown for ${request.user.email}`, error)
            response.status(500).send('error while doing keepalive')
        }
    }
})

export default router
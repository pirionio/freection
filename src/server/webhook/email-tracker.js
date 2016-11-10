import {Router} from 'express'
import logger from '../shared/utils/logger'
import path from 'path'

import {markAsReadByEmail} from '../shared/application/event-service.js'

const router = Router()

router.get('/pixel.png', (request, response) => {
    const {eventId, email} = request.query

    logger.info(`Event id ${eventId} read by email ${email}`)

    if (eventId && email) {
        markAsReadByEmail(email, eventId).catch(error => logger.error('error when calling markAsReadByEmail', error))
    }

    response.sendFile(path.join(__dirname, 'transparent-pixel.png'))
})

export default router

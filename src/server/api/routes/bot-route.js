import Router from 'express'

import * as BotService from '../../shared/application/bot-service'
import logger from '../../shared/utils/logger'

const router = Router()

router.get('/onboard', (request, response) => {
    const user = request.user

    BotService.onboard(user)
        .then(() => response.send(200))
        .catch(error => {
            logger.error(`Could not start the onboard flow for user ${user.email}`, error)
            response.status(500).send(`Could not start the onboard flow for user ${user.email}`)
        })
})

export default router
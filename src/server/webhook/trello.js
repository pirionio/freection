import {Router} from 'express'

import {User} from '../shared/models'
import * as ExternalThingService from '../shared/application/external-thing-service'
import {trelloUserToAddress} from '../shared/application/address-creator'
import * as ThingDomain from '../shared/domain/thing-domain'
import * as TrelloService from '../shared/technical/trello-service'
import logger from '../shared/utils/logger'
import ThingSource from '../../common/enums/thing-source'

const router = Router()

router.post('/:userId', async function(request, response) {
    const {action} = request.body

    const user = await User.get(request.params.userId)

    if (!user || !user.integrations || !user.integrations.trello || !user.integrations.trello.active) {
        response.sendStatus(200)
        return
    }

    try {
        if (action && action.type === 'addMemberToCard') {
            const card = action && action.data ? action.data.card : null

            if (!card) {
                const message = `Trello - could not find card for incoming notification`
                logger.warn(message)
                response.sendStatus(200)
                return
            }

            const existingThing = await ThingDomain.getUserThingByExternalId(card.id, user.id)

            if (existingThing) {
                const message = `Trello - card ${card.id} for user ${user.email} already exists in Freection - not creating it again`
                logger.warn(message)
                response.sendStatus(200)
                return
            }

            const creator = trelloUserToAddress(action.memberCreator)
            await ExternalThingService.newThing(creator, user, card.name, null, card.id, TrelloService.getCardUrl(card.id), ThingSource.TRELLO.key)

            logger.info(`Trello - notification addMemberToCard arrived for card ${card.id} - creating task in Freection`)
        }

        response.sendStatus(200)

    } catch (error) {
        const message = `Trello - error retrieving data`
        logger.error(message, error)
        response.status(500).send(message)
    }
})

export default router

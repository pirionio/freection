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
        if (action) {
            const card = (action && action.data) ? action.data.card : null

            if (!card)
                throw new Error('Could not find card for incoming notification')

            if (shouldAddMember(user, action)) {
                addMemberToCard(user, card, action.memberCreator)
            } else if (shouldDeleteMember(user, action)) {
                removeMemberFromCard(user, card, action.memberCreator)
            }
        }

        response.sendStatus(200)

    } catch (error) {
        const message = `Trello - error handling incoming notification: ${error.message}`
        logger.error(message, error)
        response.status(500).send(message)
    }
})

async function addMemberToCard(user, card, memberCreator) {
    const existingThing = await ThingDomain.getUserThingByExternalId(card.id, user.id)

    if (existingThing)
        throw new Error(`Card ${card.id} for user ${user.email} already exists in Freection - not creating it again`)

    const creator = trelloUserToAddress(memberCreator)
    await ExternalThingService.newThing(creator, user, card.name, null, card.id, TrelloService.getCardUrl(card.id), ThingSource.TRELLO.key)

    logger.info(`Notification addMemberToCard arrived for card ${card.id} - creating task in Freection`)
}

async function removeMemberFromCard(user, card, memberCreator) {
    const existingThing = await ThingDomain.getUserThingByExternalId(card.id, user.id)
    
    if (!existingThing)
        return
    
    const creator = trelloUserToAddress(memberCreator)
    await ExternalThingService.unassign(user, creator, existingThing.id)

    logger.info(`Trello - notification removeMemberFromCard arrived for card ${card.id} - unassigning user ${user.email} from thing ${existingThing.id}`)
}

function shouldAddMember(user, action) {
    return action.type === 'addMemberToCard' && action.member.id === user.integrations.trello.userId
}

function shouldDeleteMember(user, action) {
    return action.type === 'removeMemberFromCard' && action.member.id === user.integrations.trello.userId
}

export default router

import {Router} from 'express'

import {User} from '../shared/models'
import * as ExternalThingService from '../shared/application/external-thing-service'
import {trelloUserToAddress} from '../shared/application/address-creator'
import * as ThingDomain from '../shared/domain/thing-domain'
import * as TrelloService from '../shared/technical/trello-service'
import logger from '../shared/utils/logger'
import ThingSource from '../../common/enums/thing-source'
import ThingStatus from '../../common/enums/thing-status'

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

            if (!card) {
                logger.warn(`Trello - notification [${action.type}] arrived for user ${user.email} 
                    from [${action.memberCreator ? action.memberCreator.username : 'Unknown'}] 
                    but with no card in it - skipping the notification`)
                response.sendStatus(200)
                return
            }

            if (shouldAddMember(user, action)) {
                addMemberToCard(user, card, action)
            } else if (shouldDeleteMember(user, action)) {
                removeMemberFromCard(user, card, action)
            } else if (shouldListChanged(action)) {
                listChanged(user, card, action)
            }
        }

        response.sendStatus(200)

    } catch (error) {
        const message = `Trello - error handling incoming notification: ${error.message}`
        logger.error(message, error)
        response.status(500).send(message)
    }
})

async function addMemberToCard(user, card, action) {
    const creator = trelloUserToAddress(action.memberCreator)

    const existingThing = await ThingDomain.getUserThingByExternalId(card.id, user.id)

    if (existingThing && [ThingStatus.DONE.key, ThingStatus.DISMISS.key, ThingStatus.CLOSE.key].includes(existingThing.payload.status)) {
        await ExternalThingService.sendBack(creator, user, existingThing.id)
        logger.info(`Notification addMemberToCard arrived for card ${card.id} - task already exists and closed - reopening it`)
    } else if (!existingThing) {
        await ExternalThingService.newThing(creator, user, card.name, null, card.id, TrelloService.getCardUrl(card.id), ThingSource.TRELLO.key)
        logger.info(`Notification addMemberToCard arrived for card ${card.id} - creating task in Freection`)
    }
}

async function removeMemberFromCard(user, card, action) {
    const existingThing = await ThingDomain.getUserThingByExternalId(card.id, user.id)
    
    if (!existingThing || [ThingStatus.DONE.key, ThingStatus.DISMISS.key, ThingStatus.CLOSE.key].includes(existingThing.payload.status))
        return
    
    const creator = trelloUserToAddress(action.memberCreator)
    await ExternalThingService.unassign(user, creator, existingThing.id)

    logger.info(`Trello - notification removeMemberFromCard arrived for card ${card.id} - unassigning user ${user.email} from thing ${existingThing.id}`)
}

async function listChanged(user, card, action) {
    const existingThing = await ThingDomain.getUserThingByExternalId(card.id, user.id)

    if (!existingThing || [ThingStatus.DONE.key, ThingStatus.DISMISS.key, ThingStatus.CLOSE.key].includes(existingThing.payload.status))
        return

    const creator = trelloUserToAddress(action.memberCreator)
    await ExternalThingService.trelloListChanged(user, creator, existingThing.id, action.data.listBefore, action.data.listAfter)

    logger.info(`Trello - notification updateCard arrived for card ${card.id} - list changed for thing ${existingThing.id} by ${creator.displayName}`)
}

function shouldAddMember(user, action) {
    return action.type === 'addMemberToCard' && action.member.id === user.integrations.trello.userId
}

function shouldDeleteMember(user, action) {
    return action.type === 'removeMemberFromCard' && action.member.id === user.integrations.trello.userId
}

function shouldListChanged(action) {
    return action.type === 'updateCard' && action.data.listBefore && action.data.listAfter

}

export default router

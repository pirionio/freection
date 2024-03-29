import {Router} from 'express'
import {find, remove} from 'lodash'

import logger from '../../shared/utils/logger'
import {User} from '../../shared/models'
import * as TrelloService from '../../shared/technical/trello-service'
import * as ThingDomain from '../../shared/domain/thing-domain'
import * as ExternalThingService from '../../shared/application/external-thing-service'
import {trelloUserToAddress, userToAddress} from '../../shared/application/address-creator'
import ThingSource from '../../../common/enums/thing-source'

const router = Router()

router.get('/integrate', async function(request, response) {
    const user = request.user

    try {
        const result = await TrelloService.authorize()
        await User.get(user.id).update({
            integrations: {
                trello: {
                    requestToken: result.requestToken,
                    requestTokenSecret: result.requestTokenSecret
                }
            }
        }).run()

        response.redirect(302, result.redirectUrl)

    } catch (error) {
        const message = `Trello - error for user ${user.email}: ${error.message}`
        logger.error(message, error.cause)
        response.status(500).send(message)
    }
})

router.get('/callback', async function(request, response) {
    const token = request.query.oauth_token
    const verifier = request.query.oauth_verifier

    try {
        const user = await User.get(request.user.id)

        if (!user || !user.integrations || !user.integrations.trello || !user.integrations.trello.requestTokenSecret) {
            const message = `Trello - could not authorize user ${request.user.email}, could not generate token secret`
            logger.warn(message)
            response.status(403).send(message)
            return
        }

        const result = await TrelloService.getAccessToken(token, user.integrations.trello.requestTokenSecret, verifier)

        logger.info(`Integrated Freection user ${user.email} with Trello user ${result.user.username}`)

        user.integrations.trello = Object.assign(user.integrations.trello, {
            active: true,
            accessToken: result.accessToken,
            accessTokenSecret: result.accessTokenSecret,
            userId: result.user.id,
            boards: []
        })

        await user.save()

        response.redirect('/integrations?expand=trello')

    } catch (error) {
        const message = `Trello - error for user ${request.user.email}: ${error.message}`
        logger.error(message, error.cause)
        response.status(404).send(message)
    }
})

router.get('/', async function (request, response) {
    try {
        const user = await User.get(request.user.id)

        if (!user || !user.integrations || !user.integrations.trello || !user.integrations.trello.active) {
            response.json({active: false})
            return
        }

        const boardsString = await TrelloService.getBoards({
            token: user.integrations.trello.accessToken,
            secret: user.integrations.trello.accessTokenSecret
        })

        const boards = (boardsString ? JSON.parse(boardsString) : []).map(board => {
            return {
                id: board.id,
                name: board.name,
                enabled: !!find(user.integrations.trello.boards, {boardId: board.id})
            }
        })

        response.json({active: true, boards})

    } catch(error) {
        logger.error(`error while getting Trello user info for ${request.user.email}`, error)
        response.status(500).send('error while getting Trello user info')
    }
})

router.post('/enableboard/:boardId', async function(request, response) {
    const {boardId} = request.params

    if (!boardId) {
        response.status(400).send('Board ID is missing')
        return
    }

    try {
        const user = await User.get(request.user.id)

        if (!user || !user.integrations || !user.integrations.trello || !user.integrations.trello.active) {
            const message = `Could not enable board for user ${user.email} - not authorized in Trello`
            logger.warn(message)
            response.status(401).send(message)
        }

        const webhookString = await TrelloService.createWebhookForBoard(user.id, boardId, {
            token: user.integrations.trello.accessToken,
            secret: user.integrations.trello.accessTokenSecret
        })

        if (!webhookString) {
            const message = `Could not enable Trello board for user ${user.email}`
            logger.error(message)
            response.status(400).send(message)
            return
        }

        const webhook = JSON.parse(webhookString)

        user.integrations.trello.boards.push({
            boardId,
            webhookId: webhook.id
        })

        await user.save()

        await fetchUserTasks(user, boardId)
        
        response.json({})
        
    } catch(error) {
        const message = `error while enabling Trello board for user ${request.user.email}`
        logger.error(message, error)
        response.status(500).send(message)
    }
})

router.post('/disableboard/:boardId', async function(request, response) {
    const {boardId} = request.params

    if (!boardId) {
        response.status(400).send('Board ID is missing')
        return
    }

    try {
        const user = await User.get(request.user.id)

        if (!user || !user.integrations || !user.integrations.trello || !user.integrations.trello.active) {
            const message = `Could not disable board for user ${user.email} - not authorized in Trello`
            logger.warn(message)
            response.status(401).send(message)
        }

        const boardWebhook = find(user.integrations.trello.boards, {boardId})

        if (!boardWebhook) {
            const message = `Could not disable Trello board for user ${user.email} - board not found`
            logger.error(message)
            response.status(404).send(message)
            return
        }

        await TrelloService.deleteWebhook(boardWebhook.webhookId, {
            token: user.integrations.trello.accessToken,
            secret: user.integrations.trello.accessTokenSecret
        })

        remove(user.integrations.trello.boards, {webhookId: boardWebhook.webhookId})

        await user.save()

        response.json({})

    } catch(error) {
        const message = `error while disabling Trello board for user ${request.user.email}`
        logger.error(message, error)
        response.status(500).send(message)
    }
})

async function fetchUserTasks(user, boardId) {
    logger.info(`Trello - fetching tasks for user ${user.email} for board ${boardId}`)

    const cardsString = await TrelloService.getCards({
        token: user.integrations.trello.accessToken, 
        secret: user.integrations.trello.accessTokenSecret
    }, true)

    const cards = cardsString ? JSON.parse(cardsString) : []
    
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i]

        if (user && user.integrations && user.integrations.trello &&
            card.idMembers.includes(user.integrations.trello.userId) &&
            card.idBoard === boardId) {

            const createAction = find(card.actions, {type: 'createCard'})
            const creator = createAction ? trelloUserToAddress(createAction.memberCreator) : userToAddress(user)

            const existingThing = await ThingDomain.getUserThingByExternalId(card.id, user.id)

            if (!existingThing) {
                const thing = await ExternalThingService.newThing(creator, user, card.name, card.desc, card.id,
                    TrelloService.getCardUrl(card.id), ThingSource.TRELLO.key)
                await ExternalThingService.doThing(user, thing.id)

                logger.info(`Trello - created task for user ${user.email} by ${creator.displayName}`)
            } else {
                logger.info(`Trello - task in Freection already exists for Trello card ${card.id} with ${user.email} as the recipient`)
            }
        }
    }
}

export default router

import {Router} from 'express'

import logger from '../../shared/utils/logger'
import {User} from '../../shared/models'
import * as TrelloService from '../../shared/technical/trello-service'

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
    const secret = secrets[token]
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

        response.redirect('/integrations')

    } catch (error) {
        const message = `Trello - error for user ${user.email}: ${error.message}`
        logger.error(message, error.cause)
        response.status(404).send(message)
    }
})

export default router
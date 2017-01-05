import {Router} from 'express'
import {WebClient} from '@slack/client'
import {head} from 'lodash'

import {SlackTeam, User} from '../shared/models'
import slackConfig from '../shared/config/slack'
import * as ThingService from '../shared/application/thing-service'
import {post} from '../../app/util/resource-util'
import logger from '../shared/utils/logger'
import ThingSource from '../../common/enums/thing-source'

const router = Router()

router.get('/thing', (request, response) => {
    const {body} = request

    if (body.ssl_check)
        response.sendStatus(200)
    else
        response.sendStatus(400)
})

router.post('/thing', async function(request, response) {
    try {
        const {body} = request

        if (body.ssl_check) {
            response.sendStatus(200)
        } else if (body.command === '/freection') {
            if (body.token !== slackConfig.token) {
                response.sendStatus(400)
                return
            }

            const {
                command,
                team_id: teamId,
                channel_name: channelName,
                user_id: userId,
                user_name: userName,
                text,
                response_url: responseUrl
            } = body

            logger.info(`New thing from slack ${channelName} ${userName} ${command} ${text}`)

            const creator = await getUserBySlackId(userId)

            if (!creator) {
                respondWith(response, 'You are not registered on Freection, go to https://app.freection.com to join')
                return
            }

            const team = await getTeam(teamId)

            if (!team) {
                respondWith(response, 'You have to integrate Slack with Freection first')
                return
            }

            let thingText = text
            let toUserEmail

            // we need to find the mentioned user
            const mentioned = text.match(/((@[a-z0-9][a-z0-9._-]*)|me)/)
            if (!mentioned || !mentioned.length) {
                respondWith(response, 'You must mention a user. Please send again with @username, or \'me\' to send to yourself')
                return
            }

            if (mentioned[0] === 'me') {
                toUserEmail = creator.email
                respondWith(response, 'Just a second...', false)
            } else {
                toUserEmail = await getEmailFromMention(team, mentioned[0])
                respondWithEmpty(response, true)
            }

            if (!toUserEmail) {
                delayRespondWith(responseUrl, 'The mentioned user doesn\'t exist in Slack, therefore a task was not created in Freection')
                return
            }

            if (text.startsWith(mentioned[0])) {
                thingText = text.substring(mentioned[0].length + 1)
            }

            await ThingService.newThing(creator, toUserEmail, {text: thingText}, {source: ThingSource.SLACK.key})
            delayRespondWith(responseUrl, 'New task created in Freection')

        } else {
            response.sendStatus(500)
        }
    } catch(error) {
        logger.error('Slack - error while handling webhook from Slack', error)
        response.sendStatus(500)
    }
})

async function delayRespondWith(url, text, isPublic = false) {

    try {
        await post(url, {
            response_type: isPublic ? 'in_channel' : 'ephemeral',
            text: text
        }, {responseType: 'text'})
    }
    catch (error) {
        logger.error('Slack - Error while sending delay response to /freection command', error)
    }
}

function respondWith(response, text, isPublic = false) {
    response.json({
        response_type: isPublic ? 'in_channel' : 'ephemeral',
        text: text
    })
}

function respondWithEmpty(response, isPublic = false) {
    if (isPublic)
        response.json({ response_type: 'in_channel' })
    else
        response.sendStatus(200)
}

async function getUserBySlackId(userId) {
    try {
        const creator = await User.getUserBySlackId(userId)
        return creator
    } catch (error) {
        if (error === 'NotFound') {
            return null
        }

        logger.error('Slack - error while trying to get user by Slack ID from DB', error)

        throw error
    }
}

async function getTeam(teamId) {
    try {
        const team = await SlackTeam.get(teamId).run()
        return team
    } catch (error) {

        if (error.name === 'DocumentNotFoundError') {
            return null
        }


        logger.error('Slack - error while trying to get Slack team from DB', error)

        throw error
    }
}

async function getEmailFromMention(team, mention) {

    try {
        const username = mention.substring(1)

        const client = new WebClient(team.accessToken)
        const users = await client.users.list()
        const toUser = head(users.members.filter(user => user.name === username))

        if (!toUser)
            return null

        return `"${toUser.profile.real_name}" <${toUser.profile.email}>`
    } catch(error) {
        logger.error('Slack - error while trying to get Slack user from the mention parameter in the command', error)
        throw error
    }
}

export default router

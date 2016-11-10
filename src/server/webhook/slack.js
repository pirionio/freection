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
        } else if (body.command === '/thing') {
            if (body.token !== slackConfig.token) {
                response.sendStatus(400)
                return
            }

            const {
                team_id: teamId,
                channel_name: channelName,
                user_id: userId,
                user_name: userName,
                text,
                response_url: responseUrl
            } = body

            logger.info(`New thing from slack ${channelName} ${userName} ${text}`)

            const creator = await getUserBySlackId(userId)

            if (!creator) {
                respondWith(response, 'You are not registered on freection, go to http://freection.com to join')
                return
            }

            const team = await getTeam(teamId)

            if (!team) {
                respondWith(response, 'You have to integrate slack with freection first')
                return
            }

            let subject = text

            // we need to find the mentioned user
            const mentioned = text.match(/@[a-z0-9][a-z0-9._-]*/)
            if (!mentioned || !mentioned.length) {
                respondWith(response, 'You must mention a user. Please send again with @username')
                return
            }

            respondWithEmpty(response, true)

            if (text.startsWith(mentioned[0])) {
                subject = text.substring(mentioned[0].length)
            }

            const toUserEmail = await getEmailFromMention(team, mentioned[0])

            if (!toUserEmail) {
                delayRespondWith(responseUrl, 'The mentioned user doesn\'t exist in slack and therefore thing was not created on freection')
                return
            }

            await ThingService.newThing(creator, toUserEmail, subject, '', {source: ThingSource.SLACK.key})
            delayRespondWith(responseUrl, 'New thing created on freection')

        } else {
            response.sendStatus(500)
        }
    } catch(error) {
        logger.error('Slack - error while handling webhook from slack', error)
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
        logger.error('Slack - Error while sending delay response to /thing command', error)
    }
}

function respondWith(response, text, isPublic = false) {
    response.json({
        response_type: isPublic ? 'in_channel' : 'ephemeral ',
        text: text
    })
}

function respondWithEmpty(response, isPublic = false) {
    response.json({
        response_type: isPublic ? 'in_channel' : 'ephemeral '
    })
}

async function getUserBySlackId(userId) {
    try {
        const creator = await User.getUserBySlackId(userId)
        return creator
    } catch (error) {
        if (error === 'NotFound') {
            return null
        }

        logger.error('Slack - error while trying to user by slack id from db', error)

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


        logger.error('Slack - error while trying to get slack team from db', error)

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
        logger.error('Slack - error while trying to get slack user from mention', error)
        throw error
    }
}

export default router

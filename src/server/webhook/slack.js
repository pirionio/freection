import {Router} from 'express'
import {WebClient} from '@slack/client'
import {head} from 'lodash'

import {SlackTeam, User} from '../shared/models'
import slackConfig from '../shared/config/slack'
import UserTypes from '../../common/enums/user-types'
import * as SlackThingService from '../shared/application/slack-thing-service'
import * as ThingService from '../shared/application/thing-service'
import {post} from '../../app/util/resource-util'

const router = Router()

router.post('/thing', async function(request, response) {
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
            channel_id: channelId,
            channel_name: channelName,
            user_id: userId,
            text,
            response_url: responseUrl} = body

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

        let toUserAddress
        let subject = text

        if (channelName === 'directmessage') {
            responseWithEmpty(response, true)
            toUserAddress = await getSlackUserFromIMId(team, channelId)
        } else {
            // we need to find the mentioned user
            const mentioned = text.match(/@[a-z0-9][a-z0-9._-]*/)
            if (!mentioned || !mentioned.length) {
                respondWith(response, 'You must mention a user. Please send again with @username')
                return
            }

            responseWithEmpty(response, true)

            if (text.startsWith(mentioned[0])) {
                subject = text.substring(mentioned[0].length)
            }

            toUserAddress = await getSlackUserFromMention(team, mentioned[0])

            if (!toUserAddress) {
                delayRespondWith(responseUrl, 'The mentioned user doesn\'t exist in slack and therefor was not added to freection')
                return
            }
        }

        const toUser = await getUserBySlackId(toUserAddress.id)

        if (toUser) {
            await ThingService.newThing(creator, toUser.email, subject, '')
            delayRespondWith(responseUrl, 'New thing created on freection')
        } else {
            // Creating slack thing as peer is not on freection
            await SlackThingService.newThing(creator, toUserAddress, subject)
            delayRespondWith(responseUrl, 'New thing created on freection')
        }

    } else {
        response.sendStatus(500)
    }
})

function delayRespondWith(url, text, isPublic = false) {

    // TODO: log errors
    post(url, {
        response_type: isPublic ? 'in_channel' : 'ephemeral ',
        text: text
    })
}

function respondWith(response, text, isPublic = false) {
    response.json({
        response_type: isPublic ? 'in_channel' : 'ephemeral ',
        text: text
    })
}

function responseWithEmpty(response, isPublic = false) {
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

        throw error
    }
}

async function getSlackUserFromIMId(team, channelId) {
    const client = new WebClient(team.accessToken)
    const ims = await client.im.list()
    const toUserId = head(ims.ims.filter(im => im.id === channelId)).user
    const toUserName = (await client.users.info(toUserId)).user.name

    const toUser = {
        id: toUserId,
        type: UserTypes.SLACK.key,
        displayName: toUserName
    }

    return toUser
}

async function getSlackUserFromMention(team, mention) {
    const username = mention.substring(1)

    const client = new WebClient(team.accessToken)
    const users = await client.users.list()
    const toUser = head(users.members.filter(user => user.name === username))

    if (!toUser)
        return null

    return {
        id: toUser.id,
        type: UserTypes.SLACK.key,
        displayName: toUser.name
    }
}

export default router

import querystring from 'querystring'

import {Router} from 'express'
import {WebClient} from '@slack/client'

import { User, SlackTeam } from '../../shared/models'
import logger from '../../shared/utils/logger'
import config from '../../shared/config/slack'

const router = Router()
const oauthUrl = 'https://slack.com/oauth/authorize'
const signInCallback = `${config.callbackURL}/callback`
const addAppCallback = `${config.callbackURL}/callback/app`

router.get('/', async function (request, response) {
    try {
        const user = await User.get(request.user.id).run()

        if (user.integrations && user.integrations.slack && user.integrations.slack.active) {

            const isAppExist = await SlackTeam.checkIfTeamExist(user.integrations.slack.teamId)

            response.json({active: true, appInstalled: isAppExist})
        } else {
            response.json({active: false, appInstalled: false})
        }
    } catch(error) {
        logger.error(`error while getting user slack info for user ${request.user.email}`, error)
        response.status(500).send('error while getting user slack info')
    }
})

router.get('/integrate', (request, response) => {
    const scope = ['identity.basic', 'identity.team']

    const options = {
        client_id: config.clientID,
        redirect_uri: signInCallback,
        scope: scope.join(' ')
    }

    const redirectUrl = `${oauthUrl}?${querystring.stringify(options)}`

    response.redirect(302, redirectUrl)
})

router.get('/callback', async function(request, response) {
    try {
        const {code} = request.query

        let webClient = new WebClient()
        const {access_token: accessToken} =
            await webClient.oauth.access(config.clientID, config.clientSecret, code, {redirect_uri: signInCallback })

        webClient = new WebClient(accessToken)
        const identity = await webClient.users.identity()

        await User.get(request.user.id).update({
            integrations: {
                slack: {
                    active: true,
                    accessToken,
                    teamId: identity.team.id,
                    teamName: identity.team.name,
                    userId: identity.user.id,
                    username: identity.user.name
                }
            }
        }).run()

        response.redirect('/integrations?expand=slack')
    } catch (error) {
        logger.error(`error while integrating slack for user ${request.user.email}`, error)
        response.sendStatus(500)
    }
})

router.get('/addapp', async function(request, response) {
    const user = await User.get(request.user.id).run()

    if (user.integrations && user.integrations.slack && user.integrations.slack.active) {

        const scope = ['commands', 'users:read', 'chat:write:bot']

        const options = {
            client_id: config.clientID,
            redirect_uri: addAppCallback,
            scope: scope.join(' '),
            team: user.integrations.slack.teamId
        }

        const redirectUrl = `${oauthUrl}?${querystring.stringify(options)}`

        response.redirect(302, redirectUrl)
    } else {
        response.status(400).send('user is not signed in with slack')
    }
})


router.get('/callback/app', async function(request, response) {
    try {
        const {code} = request.query

        const webClient = new WebClient()
        const access = await webClient.oauth.access(config.clientID, config.clientSecret, code, {redirect_uri: addAppCallback})

        await SlackTeam.save({
            accessToken: access.access_token,
            id: access.team_id,
            name: access.team_name
        }, {conflict: 'replace'})

        response.redirect('/integrations?expand=slack')
    } catch (error) {
        logger.error(`error while add app to slack by user ${request.user.email}`, error)
        response.sendStatus(500)
    }
})

export default router
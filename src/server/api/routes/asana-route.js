import querystring from 'querystring'

import asana from 'asana'
import {flatten, toString} from 'lodash'
import {Router} from 'express'

import { User } from '../../shared/models'
import logger from '../../shared/utils/logger'
import config from '../../shared/config/asana'
import {post} from '../../../app/util/resource-util.js'

const router = Router()
const oauthUrl = 'https://app.asana.com/-/oauth_authorize'

router.get('/', async function (request, response) {
    try {
        const user = await User.get(request.user.id)

        if (user.integrations && user.integrations.asana && user.integrations.asana.active) {

            const projects = await getProjects(user)

            response.json({active: true, projects})
        }
        else
            response.json({ active: false })
    } catch(error) {
        logger.error(`error while getting Asana info for user ${request.user.email}`, error)
        response.status(500).send('error while getting user Asana info')
    }
})

router.post('/enableProject/:projectId', async function (request, response) {
    const {projectId} = request.params

    if (!projectId) {
        response.status(400).send('Project id is missing')
        return
    }

    try {
        await User.appendAsanaProject(request.user.id, toString(projectId))
        response.json({})
    } catch(error) {
        logger.error(`error while enabling Asana project for user ${request.user.email}`, error)
        response.status(500).send('error while enabling Asana project')
    }
})

router.post('/disableProject/:projectId', async function (request, response) {
    const {projectId} = request.params

    if (!projectId) {
        response.status(400).send('Project id is missing')
        return
    }

    try {
        await User.removeAsanaProject(request.user.id, toString(projectId))
        response.json({})
    } catch(error) {
        logger.error(`error while disabling Asana project for user ${request.user.email}`, error)
        response.status(500).send('error while disabling Asana project')
    }
})


router.get('/integrate', (request, response) => {

    const options = {
        client_id: config.clientID,
        redirect_uri: config.callbackURL,
        response_type: 'code'
    }

    const redirectUrl = `${oauthUrl}?${querystring.stringify(options)}`

    response.redirect(302, redirectUrl)
})

router.get('/callback', async function(request, response) {
    try {
        const {code} = request.query

        const body = {
            grant_type: 'authorization_code',
            client_id: config.clientID,
            client_secret: config.clientSecret,
            redirect_uri: config.callbackURL,
            code
        }

        const {refresh_token: refreshToken, access_token: accessToken} =
            await post('https://app.asana.com/-/oauth_token', body, {requestType: 'form'})

        const client = asana.Client.create()
        client.useOauth({
            credentials: {
                access_token: accessToken
            }
        })

        const me = await client.users.me()

        await User.get(request.user.id).update({
            integrations: {
                asana: {
                    active: true,
                    accessToken,
                    refreshToken,
                    userId: toString(me.id),
                    projects: []
                }
            }
        }).run()

        response.redirect('/integrations/asana')
    } catch (error) {
        logger.error(`error while integrating Asana for user ${request.user.email}`, error)
        response.sendStatus(500)
    }
})

async function getTeams(client) {
    const organizations = await getOrganizations(client)

    const teams = await Promise.all(organizations.map(async function (organization) {
        const orgTeams = await collectionToArray(await client.teams.findByUser('me', {organization: organization.id}))

        return orgTeams.map(team => {
            return {
                id: team.id,
                name: team.name,
                organization: organization
            }
        })
    }))

    return flatten(teams)
}

async function getOrganizations(client) {
    const workspaces = await collectionToArray(await client.workspaces.findAll())

    const workspacesFull = await Promise.all(workspaces.map(workspace => client.workspaces.findById(workspace.id)))

    return workspacesFull.filter(workspace => workspace.is_organization)
}

async function getProjects(user) {
    const client = asana.Client.create({
        clientId: config.clientID,
        clientSecret: config.clientSecret,
        redirectUri: config.callbackURL
    })
    client.useOauth({
        credentials: {
            refresh_token: user.integrations.asana.refreshToken
        }
    })

    const teams = await getTeams(client)

    const projects = await Promise.all(teams.map(async function(team) {
        const teamProjects = await collectionToArray(await client.projects.findByTeam(team.id))

        return teamProjects.map(project => {
            const projectId = toString(project.id)

            return {
                id: projectId,
                name: project.name,
                team: team.name,
                organization: team.organization.name,
                enabled: user.integrations.asana.projects.includes(projectId)
            }
        })
    }))

    return flatten(projects)
}

function collectionToArray(streamWrapper) {
    const stream = streamWrapper.stream()

    return new Promise((resolve, reject) => {
        const items = []

        stream.on('data', project => {
            items.push(project)
        })

        stream.on('end', () => resolve(items))

        stream.on('error', error => reject(error))
    })
}



export default router